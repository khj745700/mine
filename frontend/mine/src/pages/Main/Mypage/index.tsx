/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { userInfoContainerCss } from './style';
import { useSuspenseQuery } from '@tanstack/react-query';
import { IUserInfo } from '../../../interfaces/userInterface';
import { AxiosResponse } from 'axios';
import { IAvatar } from '../../../interfaces/avatarInterface';
import { getMainAvatar } from '../../../utils/avatarUtils';
import UserInfo from './UserInfo';
import ManageInfo from './ManageInfo';
import AvatarProfile from './AvatarProfile';

const Mypage = () => {
  const userQuery = useSuspenseQuery<AxiosResponse<IUserInfo>>({
    queryKey: ['userinfo'],
  }).data;
  const avatarQuery = useSuspenseQuery<AxiosResponse<IAvatar[]>>({
    queryKey: ['avatarinfo'],
  }).data;
  const [curAvatar, setCurAvatar] = useState<string>(
    avatarQuery.data.length
      ? getMainAvatar(avatarQuery.data).avatarModel
      : 'pig',
  );

  return (
    <>
      <div css={userInfoContainerCss}>
        <UserInfo avatarModel={curAvatar} info={userQuery.data} />
        <AvatarProfile avatars={avatarQuery.data} />
        <ManageInfo
          title={'내정보'}
          labels={['nickEdit', 'pwdEdit', 'achievement']}
          url={['/mypage/nick', '/mypage/pwd', '/mypage/achievement']}
          data={[userQuery?.data.nickname]}
        />
        <ManageInfo
          title={'아바타'}
          labels={['infoEdit', 'qnaEdit']}
          url={['/mypage/avatar', '/mypage/avatar/qna']}
          data={[]}
          avatars={avatarQuery?.data}
        />
      </div>
    </>
  );
};

export default Mypage;
