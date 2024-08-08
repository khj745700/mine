/** @jsxImportSource @emotion/react */
import React from 'react';
import { containerCss, profileCss } from './style';
import { Button, Typography } from 'oyc-ds';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IAvatar } from '../../../../interfaces/avatarInterface';
import {
  AvatarInfoUpdateRequestData,
  updateAvatarInfo,
} from '../../../../apis/avatarApi';
import useDialog from '../../../../hooks/useDialog';

interface AvatarProfileProps {
  avatars: IAvatar[];
}

const AvatarProfile = ({ avatars }: AvatarProfileProps) => {
  const queryClient = useQueryClient();
  const { alert } = useDialog();
  const { mutate } = useMutation({
    mutationFn: async (info: AvatarInfoUpdateRequestData) =>
      await updateAvatarInfo(info),
    onSuccess: (data) => {
      if (data.status === 200) {
        queryClient.invalidateQueries({ queryKey: ['avatarinfo'] });
      }
    },
    onError: () => alert('오류가 발생하였습니다.'),
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
                      value: true,
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
