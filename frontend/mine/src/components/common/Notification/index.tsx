/** @jsxImportSource @emotion/react */
import React from 'react';
import { BackDrop, Toast, Typography } from 'oyc-ds';
import { toastCss } from './style';
import { INotification } from '../../../hooks/useNotification';

const Notification = ({ notiInfo }: INotification) => {
  return (
    <BackDrop opacity={0} blur={0}>
      <div css={toastCss}>
        <Toast variant={notiInfo.variant} color={notiInfo.color}>
          <Typography size="md" color="dark">
            {notiInfo.msg}
          </Typography>
        </Toast>
      </div>
    </BackDrop>
  );
};

export default Notification;
