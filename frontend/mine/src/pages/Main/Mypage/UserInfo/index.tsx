/** @jsxImportSource @emotion/react */
import React from 'react';
import { avatarCss, infoContainerCss, infoCss, userInfoCss } from './style';
import { engToIcon } from '../../../../utils/EngToIcon';
import { Icon, Typography } from 'oyc-ds';
import Avatar3D from '../../../../components/atoms/Avatar3D';

interface IUserInfo {
  email: string;
  nickname: string;
  gender: string;
}

interface UserInfoProps {
  avatarModel: string;
  info: IUserInfo;
}

const UserInfo = ({ avatarModel, info }: UserInfoProps) => {
  return (
    <div css={userInfoCss}>
      <div css={avatarCss}>
        <Avatar3D avatarModel={avatarModel ? avatarModel : 'pig'} />
      </div>
      <div css={infoContainerCss}>
        <div css={infoCss}>
          <Icon>{engToIcon['email']}</Icon>
          <Typography size="sm" color="dark">
            {info.email}
          </Typography>
        </div>
        <div css={infoCss}>
          <Icon>{engToIcon['nickname']}</Icon>
          <Typography size="sm" color="dark">
            {info.nickname}
          </Typography>
        </div>
        <div css={infoCss}>
          <Icon>{engToIcon['gender']}</Icon>
          <Typography size="sm" color="dark">
            {info.gender}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
