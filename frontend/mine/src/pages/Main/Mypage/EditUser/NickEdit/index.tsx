/** @jsxImportSource @emotion/react */
import React, { useCallback, useContext, useState } from 'react';
import AppBar from '../../../../../components/organisms/AppBar';
import useDialog from '../../../../../hooks/useDialog';
import { contentCss, nickEditContainerCss } from './style';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography } from 'oyc-ds';
import { updateNickname } from '../../../../../apis/mypageApi';
import { NotificationContext } from '../../../../../utils/NotificationContext';
import { Palette } from 'oyc-ds/dist/themes/lightTheme';
import { useMutation } from '@tanstack/react-query';

const NickEdit = () => {
  const nav = useNavigate();
  const location = useLocation();
  const notificationContext = useContext(NotificationContext);
  const [newNick, setNewNick] = useState<string>('');
  const [color, setColor] = useState<Palette>('primary');
  const [label, setLabel] = useState<string>('');
  const { alert } = useDialog();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewNick(e.target.value);
    },
    [],
  );

  const nickValidation = useCallback(async () => {
    if (newNick.length === 0) {
      setColor('danger');
      setLabel('닉네임을 입력해주세요');
    } else if (newNick.length > 10) {
      setColor('danger');
      setLabel('10자 이하의 닉네임');
    } else if (newNick === location.state.data) {
      setColor('danger');
      setLabel('동일한 닉네임');
    } else {
      setColor('success');
      setLabel('사용 가능한 닉네임');
    }
  }, [newNick]);

  const { mutate } = useMutation({
    mutationFn: async (nick: string) => await updateNickname(nick),
    onSuccess: () => {
      notificationContext.handle(
        'contained',
        'success',
        '닉네임이 성공적으로 변경되었습니다',
      );
      nav('/', { state: { step: 2 } });
    },
    onError: () => {
      alert('오류가 발생하였습니다.');
    },
  });

  return (
    <>
      <div css={nickEditContainerCss}>
        <AppBar
          label="닉네임 변경"
          onBackClick={() => nav('/', { state: { step: 2 } })}
        />
        <div css={contentCss}>
          <Typography size="lg" color="dark">
            현재 닉네임 : {location.state.data}
          </Typography>
          <TextField
            color={color}
            variant="outlined"
            label={label}
            defaultValue=""
            placeholder="닉네임을 입력해주세요"
            onChange={handleInputChange}
            onKeyUp={nickValidation}
          />
          <Button
            fullWidth
            disabled={!(color === 'success')}
            onClick={() => mutate(newNick)}
          >
            변경하기
          </Button>
        </div>
      </div>
    </>
  );
};

export default NickEdit;
