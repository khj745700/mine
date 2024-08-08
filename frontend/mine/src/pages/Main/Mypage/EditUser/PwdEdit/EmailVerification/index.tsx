/** @jsxImportSource @emotion/react */
import React, { useCallback, useState } from 'react';
import { Button, TextField, Typography } from 'oyc-ds';
import {
  emailInputCss,
  emailVerificationCss,
  codeInputCss,
  nextStepBtnCss,
} from './style';
import { Palette } from 'oyc-ds/dist/themes/lightTheme';
import { sendCode, verifyCode } from '../../../../../../apis/mypageApi';
import { useMutation } from '@tanstack/react-query';
import useDialog from '../../../../../../hooks/useDialog';

interface EmailVerificationProps {
  nextStep: () => void;
}

const EmailVerification = ({ nextStep }: EmailVerificationProps) => {
  const emailCheck = /^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+\.[A-za-z0-9-]+/;
  const { alert } = useDialog();
  const [emailColor, setEmailColor] = useState<Palette>('primary');
  const [email, setEmail] = useState<string>('');
  const [codeColor, setCodeColor] = useState<Palette>('primary');
  const [code, setCode] = useState<string>('');
  const [step, setStep] = useState<number>(0);

  /* 이메일 입력 */
  const handleInputEmail = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    },
    [],
  );
  const emailValidation = useCallback(async () => {
    if (email.length === 0 || !emailCheck.test(email)) setEmailColor('danger');
    else setEmailColor('success');
  }, [email]);

  /* 인증번호 입력 */
  const handleInputCode = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCode(e.target.value);
    },
    [],
  );
  const codeValidation = useCallback(async () => {
    if (code.length !== 6) setCodeColor('danger');
    else setCodeColor('success');
  }, [code]);

  const handleEmail = useMutation({
    mutationFn: () => sendCode(email),
    onSuccess: () => setStep(1),
    onError: () => alert('오류가 발생하였습니다.'),
  });

  const handleCode = useMutation({
    mutationFn: () => verifyCode(email, code),
    onSuccess: () => setStep(2),
    onError: () => alert('일치하지 않는 인증번호입니다.'),
  });

  return (
    <>
      <div css={emailVerificationCss}>
        <Typography size={'xl'} weight={'medium'} color={'dark'}>
          이메일을 입력해주세요
        </Typography>
        <div css={emailInputCss}>
          <div style={{ flex: '1' }}>
            <TextField
              variant="outlined"
              color={emailColor}
              label="이메일을 입력해주세요"
              placeholder="abc@abc.com"
              defaultValue=""
              onChange={handleInputEmail}
              onKeyUp={emailValidation}
            />
          </div>
          <Button
            size="md"
            disabled={!(emailColor === 'success')}
            onClick={() => handleEmail.mutate()}
          >
            전송
          </Button>
        </div>
        <div css={codeInputCss(step)}>
          <div style={{ flex: '1' }}>
            <TextField
              variant="outlined"
              color={codeColor}
              label="인증번호를 입력해주세요"
              placeholder="xxxxxx"
              defaultValue=""
              onChange={handleInputCode}
              onKeyUp={codeValidation}
            />
          </div>
          <Button
            size="md"
            disabled={!(codeColor === 'success')}
            onClick={() => handleCode.mutate()}
          >
            인증
          </Button>
        </div>
        <Button css={nextStepBtnCss(step)} onClick={() => nextStep()}>
          다음
        </Button>
      </div>
    </>
  );
};

export default EmailVerification;
