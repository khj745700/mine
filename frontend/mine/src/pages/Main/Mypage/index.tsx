/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { containerCss } from './style';
import { useSuspenseQueries } from '@tanstack/react-query';
import { getUserAvatars, getUserInfo } from '../../../apis/mypageApi';
import UserInfo from './UserInfo';
import ManageInfo from './ManageInfo';
import AvatarProfile from './AvatarProfile';

const MypageV2 = () => {
  const [userQuery, avatarQuery] = useSuspenseQueries({
    queries: [
      { queryKey: ['userinfo'], queryFn: async () => await getUserInfo() },
      { queryKey: ['avatarinfo'], queryFn: async () => await getUserAvatars() },
    ],
  });

  [userQuery, avatarQuery].some((query) => {
    if (query.error && !query.isFetching) {
      throw query.error;
    }
  });

  const [curAvatar, setCurAvatar] = useState<string>('pig');

  useEffect(() => {
    if (avatarQuery.data.data.length === 1) {
      setCurAvatar(avatarQuery.data.data[0].avatarModel);
    } else if (avatarQuery.data.data.length === 2) {
      setCurAvatar(
        avatarQuery.data.data[0].isMain
          ? avatarQuery.data.data[0].avatarModel
          : avatarQuery.data.data[1].avatarModel,
      );
    }
  }, []);

  return (
    <>
      <div css={containerCss}>
        <UserInfo avatarModel={curAvatar} info={userQuery.data.data} />
        <AvatarProfile avatars={avatarQuery.data.data} />
        <ManageInfo
          title={'내정보'}
          labels={['nickEdit', 'pwdEdit', 'achievement']}
          url={['/mypage/nick', '/mypage/pwd', '/mypage/achievement']}
          data={[userQuery.data.data.nickname]}
        />
        <ManageInfo
          title={'아바타'}
          labels={['infoEdit', 'qnaEdit']}
          url={['/mypage/avatar', '/mypage/avatar/qna']}
          data={[]}
          avatars={avatarQuery.data.data}
        />
      </div>
    </>
  );
};

export default MypageV2;
