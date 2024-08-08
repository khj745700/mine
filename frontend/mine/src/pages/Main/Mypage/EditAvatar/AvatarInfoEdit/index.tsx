/** @jsxImportSource @emotion/react */
import React, { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Palette } from 'oyc-ds/dist/themes/lightTheme';
import { avatarInfoEditContainerCss, contentCss } from './style';
import AppBar from '../../../../../components/organisms/AppBar';
import { Button, TextField, Typography } from 'oyc-ds';
import useDialog from '../../../../../hooks/useDialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAvatarInfo } from '../../../../../apis/avatarApi';
import useNotification from '../../../../../hooks/useNotification';

const AvatarInfoEdit = () => {
  const nav = useNavigate();
  const location = useLocation();
  const noti = useNotification();
  const queryClient = useQueryClient();
  const { alert } = useDialog();
  const [newInfo, setNewInfo] = useState<string>('');
  const [color, setColor] = useState<Palette>('primary');
  const [label, setLabel] = useState<string>('');
  const [colName, setColName] = useState<string>(
    location.state.colName === 'avatarName'
      ? '이름'
      : location.state.colName === 'job'
        ? '직업'
        : '거주지',
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setNewInfo(e.target.value),
    [],
  );

  const validator = useCallback(() => {
    if (newInfo.length === 0) {
      setColor('danger');
      setLabel(`${colName}을 입력해주세요`);
    } else if (newInfo.length > 10) {
      setColor('danger');
      setLabel(`10자 이하의 ${colName}`);
    } else if (newInfo === location.state.oldInfo) {
      setColor('danger');
      setLabel(`동일한 ${colName}`);
    } else {
      setColor('success');
      setLabel(`사용 가능한 ${colName}`);
    }
  }, [newInfo]);

  const { mutate } = useMutation({
    mutationFn: async () =>
      await updateAvatarInfo({
        avatarId: location.state.avatarId,
        infoType: location.state.colName,
        value: newInfo,
      }),
    onSuccess: (data) => {
      if (data.status === 202) {
        queryClient.invalidateQueries({ queryKey: ['avatarinfo'] });
        noti.handle('contained', 'success', '정보가 성공적으로 변경되었습니다');
        nav('/', { state: { step: 2 } });
      }
    },
    onError: () => {
      alert('오류가 발생하였습니다.');
    },
  });

  return (
    <>
      <div css={avatarInfoEditContainerCss}>
        <AppBar label={`${colName} 변경`} onBackClick={() => nav(-1)} />
        <div css={contentCss}>
          <Typography size="lg" color="dark">
            현재 {colName} : {location.state.oldInfo}
          </Typography>
          <TextField
            color={color}
            variant="outlined"
            label={label}
            defaultValue=""
            placeholder={`${colName}을 입력해주세요`}
            onChange={handleInputChange}
            onKeyUp={validator}
          />
          <Button
            fullWidth
            disabled={!(color === 'success')}
            onClick={() => mutate()}
          >
            변경하기
          </Button>
        </div>
      </div>
    </>
  );
};

export default AvatarInfoEdit;
