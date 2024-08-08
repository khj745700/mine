import { IAvatar } from '../interfaces/avatarInterface';

export const getMainAvatar = (avatars: IAvatar[]): IAvatar => {
  return avatars[0].isMain ? avatars[0] : avatars[1];
};
