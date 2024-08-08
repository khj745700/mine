/** @jsxImportSource @emotion/react */
import React from 'react';
import { userInfoContainerCss, avatarCss, infoCss } from './style';
import { IUserInfo } from '../../../../interfaces/userInterface';
import Avatar3D from '../../../../components/atoms/Avatar3D';
import LabeledIcon from '../../../../components/molecules/LabeledIcon';

interface UserInfoProps {
  avatarModel: string;
  info: IUserInfo;
}

const UserInfo = ({ avatarModel, info }: UserInfoProps) => {
  return (
    <div css={userInfoContainerCss}>
      <div css={avatarCss}>
        <Avatar3D avatarModel={avatarModel} />
      </div>
      <div css={infoCss}>
        <LabeledIcon label="email" content={info.email} />
        <LabeledIcon label="nickname" content={info.nickname} />
        <LabeledIcon label="gender" content={info.gender} />
      </div>
    </div>
  );
};

export default UserInfo;
