/** @jsxImportSource @emotion/react */
import React, { ReactNode, useState } from 'react';
import { Button, Dropdown, Icon, Typography } from 'oyc-ds';
import { engToIcon } from '../../../../utils/EngToIcon';
import { engToKor } from '../../../../utils/EngToKor';
import { btnContainerCss, btnCss, containerCss } from './style';
import { useNavigate } from 'react-router-dom';
import { IAvatar } from '../AvatarProfile';

interface ManageInfoProps {
  title: string;
  labels: string[];
  url: string[];
  data: ReactNode[];
  avatars?: IAvatar[];
}

const ManageInfo = ({ title, labels, url, data, avatars }: ManageInfoProps) => {
  const nav = useNavigate();
  const [avatarIdx, setAvatarIdx] = useState<number>(0);

  const handleAvatarChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const curAvatar = (e.target as HTMLSelectElement).value;
    setAvatarIdx(Number(curAvatar));
  };

  return (
    <div css={containerCss}>
      {title === '아바타' ? (
        avatars?.length === 0 ? (
          <Typography color="dark">아바타</Typography>
        ) : (
          <div style={{ width: 'fit-content' }}>
            <Dropdown
              size="sm"
              onChangeCapture={handleAvatarChange}
              style={{ border: '0', paddingLeft: '0' }}
            >
              {avatars?.map((avatar: IAvatar, idx: number) => {
                return (
                  <Dropdown.Item key={avatar.avatarId} value={idx}>
                    {avatar.avatarName}
                  </Dropdown.Item>
                );
              })}
            </Dropdown>
          </div>
        )
      ) : (
        <Typography color="dark">{title}</Typography>
      )}
      <div css={btnContainerCss}>
        {title === '아바타' ? (
          avatars?.length === 0 ? (
            <Button
              size="lg"
              variant="contained"
              color="light"
              css={btnCss}
              onClick={() => console.log('아바타 생성')}
            >
              <Icon>{engToIcon['avatar']}</Icon>
              <Typography color="dark">아바타 생성하기</Typography>
            </Button>
          ) : (
            labels.map((label: string, idx: number) => {
              return (
                <Button
                  key={label}
                  size="lg"
                  variant="contained"
                  color="light"
                  css={btnCss}
                  onClick={() =>
                    nav(url[idx], {
                      state: { data: avatars && avatars[avatarIdx] },
                    })
                  }
                >
                  <Icon>{engToIcon[label]}</Icon>
                  <Typography color="dark">{engToKor[label]}</Typography>
                </Button>
              );
            })
          )
        ) : (
          labels.map((label: string, idx: number) => {
            return (
              <Button
                key={label}
                size="lg"
                variant="contained"
                color="light"
                css={btnCss}
                onClick={() => nav(url[idx], { state: { data: data[idx] } })}
              >
                <Icon>{engToIcon[label]}</Icon>
                <Typography color="dark">{engToKor[label]}</Typography>
              </Button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ManageInfo;
