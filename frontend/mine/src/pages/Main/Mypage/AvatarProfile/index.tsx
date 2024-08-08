/** @jsxImportSource @emotion/react */
import React from 'react';
import { containerCss, profileCss } from './style';
import { Button, Typography } from 'oyc-ds';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAvatarInfo } from '../../../../apis/mypageApi';
import useDialog from '../../../../hooks/useDialog';

export interface IAvatar {
  avatarId: number;
  avatarName: string;
  birthday: string;
  personality: string;
  residence: string;
  voiceId: string;
  job: string;
  avatarModel: string;
  isMain: boolean;
}

interface AvatarProfileProps {
  avatars: IAvatar[];
}

interface UpdateData {
  avatarId: number;
  infoType: string;
}

const AvatarProfile = ({ avatars }: AvatarProfileProps) => {
  const queryClient = useQueryClient();
  const { alert } = useDialog();

  const { mutate } = useMutation({
    mutationFn: (data: UpdateData) =>
      updateAvatarInfo(data.avatarId, data.infoType, true),
    onSuccess: (data) => {
      if (data.status === 200) {
        queryClient.invalidateQueries({ queryKey: ['avatarinfo'] });
      }
    },
    onError: () => {
      alert('오류가 발생하였습니다.');
    },
  });

  return (
    <div css={containerCss}>
      {avatars.length ? (
        <>
          {avatars.map((avatar: IAvatar) => {
            return (
              <div key={avatar.avatarName} css={profileCss}>
                <Typography
                  size="md"
                  color={avatar.isMain ? 'primary' : 'dark'}
                >
                  {avatar.avatarName}
                </Typography>
                <Button
                  size="sm"
                  color={avatar.isMain ? 'secondary' : 'primary'}
                  disabled={avatar.isMain}
                  onClick={() =>
                    mutate({
                      avatarId: avatar.avatarId,
                      infoType: 'isMain',
                    })
                  }
                >
                  <Typography size="xs" color="dark">
                    아바타 지정
                  </Typography>
                </Button>
              </div>
            );
          })}
        </>
      ) : (
        <div>아바타 없음</div>
      )}
    </div>
  );
};

export default AvatarProfile;
