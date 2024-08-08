/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { avatarCss, avatarInfoBoxCss, avatarInfoBtn } from './style';
import InfoBox from '../../../../components/molecules/InfoBox/InfoBox';
import { IAvatar } from '../AvatarProfile';
import dayjs from 'dayjs';
import { Button } from 'oyc-ds';
import { useLocation, useNavigate } from 'react-router-dom';
import AppBar from '../../../../components/organisms/AppBar';
import Avatar3D from '../../../../components/atoms/Avatar3D';

const AvatarInfo = () => {
  const nav = useNavigate();
  const location = useLocation();
  const [avatar, setAvatar] = useState<IAvatar>(location.state.data);

  return (
    <>
      <AppBar
        label="아바타"
        onBackClick={() => nav('/', { state: { step: 2 } })}
      />
      <div css={avatarCss}>
        <Avatar3D avatarModel={avatar.avatarModel} />
      </div>
      <div css={avatarInfoBoxCss}>
        <InfoBox label={'name'} content={avatar.avatarName} />
        <InfoBox
          label={'birthday'}
          content={dayjs(avatar.birthday).format('YYYY-MM-DD')}
        />
        <InfoBox label={'personality'} content={avatar.personality} />
        <InfoBox label={'job'} content={avatar.job} />
        <InfoBox label={'residence'} content={avatar.residence} />
      </div>
      <div css={avatarInfoBtn}>
        <Button
          fullWidth
          onClick={() =>
            nav('/mypage/avatar/info', {
              state: {
                avatarId: avatar.avatarId,
                colName: 'avatarName',
                oldInfo: avatar.avatarName,
              },
            })
          }
        >
          이름 변경
        </Button>
        <Button
          fullWidth
          onClick={() =>
            nav('/mypage/avatar/info', {
              state: {
                avatarId: avatar.avatarId,
                colName: 'job',
                oldInfo: avatar.job,
              },
            })
          }
        >
          직업 변경
        </Button>
        <Button
          fullWidth
          onClick={() =>
            nav('/mypage/avatar/info', {
              state: {
                avatarId: avatar.avatarId,
                colName: 'residence',
                oldInfo: avatar.residence,
              },
            })
          }
        >
          거주지 변경
        </Button>
      </div>
    </>
  );
};

export default AvatarInfo;
