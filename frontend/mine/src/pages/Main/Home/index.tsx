/** @jsxImportSource @emotion/react */
import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { IUserInfo } from '../../../interfaces/userInterface';
import { IAvatar } from '../../../interfaces/avatarInterface';
import { updateAttendenceAchievement } from '../../../apis/authApi';
import {
  avatarCss,
  conversationCss,
  homeContainerCss,
  mentCss,
  toggleCss,
} from './style';
import { Button, Toggle, Typography } from 'oyc-ds';
import { getMainAvatar } from '../../../utils/avatarUtils';
import Avatar3D from '../../../components/atoms/Avatar3D';

const Home = () => {
  const [isOn, setIsOn] = useState<boolean>(false);
  const userQuery = useSuspenseQuery<AxiosResponse<IUserInfo>>({
    queryKey: ['userinfo'],
  }).data;
  const avatarQuery = useSuspenseQuery<AxiosResponse<IAvatar[]>>({
    queryKey: ['avatarinfo'],
  }).data;
  const { mutate } = useMutation({
    mutationFn: async () => await updateAttendenceAchievement(),
  });
  const handleToggle = useCallback(() => {
    localStorage.setItem('voiceToggle', isOn ? 'off' : 'on');
    setIsOn((prev) => (prev ? false : true));
  }, []);
  useEffect(() => {
    if (localStorage.getItem('voiceToggle')) {
      setIsOn(localStorage.getItem('voiceToggle') === 'on' ? true : false);
    } else {
      localStorage.setItem('voiceToggle', 'on');
      setIsOn(true);
    }
    mutate();
  }, []);
  return (
    <>
      <div css={homeContainerCss}>
        <Typography color="dark" css={mentCss}>
          반가워{' '}
          <Typography color="dark" size="xl" style={{ display: 'inline' }}>
            {userQuery.data.nickname}
          </Typography>
          <br />
          {avatarQuery.data.length === 0 ? (
            '너의 아바타를 만들어봐'
          ) : (
            <>
              난 너의 비서{' '}
              <Typography color="dark" size="xl" style={{ display: 'inline' }}>
                {getMainAvatar(avatarQuery.data).avatarName}
              </Typography>{' '}
              이야
            </>
          )}
        </Typography>
        <div css={toggleCss}>
          <Typography color="dark">
            {isOn ? '음성 켜기' : '음성 끄기'}
          </Typography>
          <Toggle onClick={() => handleToggle} />
        </div>
        <div css={avatarCss}>
          <Avatar3D
            avatarModel={
              avatarQuery.data.length
                ? getMainAvatar(avatarQuery.data).avatarModel
                : 'pig'
            }
          />
        </div>
        <div css={conversationCss}>
          <Typography color="dark" size="md">
            {avatarQuery.data.length
              ? '오늘도 보러 와줘서 고마워'
              : '너만의 비서를 만들어봐'}
          </Typography>
          {!avatarQuery.data.length && <Button>아바타 생성</Button>}
        </div>
      </div>
    </>
  );
};

export default Home;
