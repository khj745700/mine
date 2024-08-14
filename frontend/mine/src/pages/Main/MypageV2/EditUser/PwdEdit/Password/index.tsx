/** @jsxImportSource @emotion/react */
import { Button, TextField, Typography } from 'oyc-ds';
import React, { useCallback, useContext, useState } from 'react';
import { pwdVerificationCss } from './style';
import { Palette } from 'oyc-ds/dist/themes/lightTheme';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../../../../../../utils/NotificationContext';
import { updatePassword } from '../../../../../../apis/mypageApi';
import { useMutation } from '@tanstack/react-query';
import useDialog from '../../../../../../hooks/useDialog';

const Password = () => {
  const notificationContext = useContext(NotificationContext);
  const nav = useNavigate();
  const pwdCheck = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
  const { alert } = useDialog();
  const [color, setColor] = useState<Palette>('primary');
  const [pwd, setPwd] = useState<string>('');

  const handleInputPwd = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPwd(e.target.value);
    },
    [],
  );
  const pwdValidation = useCallback(async () => {
    if (pwd.length === 0 || !pwdCheck.test(pwd)) setColor('danger');
    else setColor('success');
  }, [pwd]);

  const { mutate } = useMutation({
    mutationFn: () => updatePassword(pwd),
    onSuccess: () => {
      notificationContext.handle(
        'contained',
        'success',
        '비밀번호를 변경하였습니다',
      );
      
      if (localStorage.getItem('isLoggedIn')) {
        nav('/', { state: { step: 2 } });
      } else {
        nav('/user/login')
      }
    },
    onError: () => alert('비밀번호 변경에 실패했습니다.'),
  });

  return (
    <>
      <div css={pwdVerificationCss}>
        <Typography size={'xl'} weight={'medium'} color={'dark'}>
          비밀번호를 입력해주세요
        </Typography>
        <div style={{ marginTop: '1rem' }}></div>
        <TextField
          variant="outlined"
          color={color}
          label="비밀번호를 입력해주세요"
          placeholder="소문자, 숫자 8자 이상"
          defaultValue=""
          onChange={handleInputPwd}
          onKeyUp={pwdValidation}
          type="password"
        />
        <Button disabled={!(color === 'success')} onClick={() => mutate()}>
          변경
        </Button>
      </div>
    </>
  );
};

export default Password;
