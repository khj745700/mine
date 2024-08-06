import React, { ReactNode } from 'react';
import {
  ArchiveBoxIcon,
  EnvelopeIcon,
  InformationCircleIcon,
  TagIcon,
  UserIcon,
  ChatBubbleBottomCenterTextIcon,
  HomeIcon,
  MicrophoneIcon,
  CakeIcon,
  BriefcaseIcon,
  MapIcon,
  KeyIcon,
  PencilIcon,
  CursorArrowRaysIcon,
} from '@heroicons/react/24/outline';

export const engToIcon: Record<string, ReactNode> = {
  email: <EnvelopeIcon />,
  nickname: <TagIcon />,
  gender: <UserIcon />,
  avatar: <UserIcon />,
  achievement: <ArchiveBoxIcon />,
  userInfo: <InformationCircleIcon />,
  chatting: <ChatBubbleBottomCenterTextIcon />,
  home: <HomeIcon />,
  speech: <MicrophoneIcon />,
  name: <TagIcon />,
  birthday: <CakeIcon />,
  personality: <UserIcon />,
  job: <BriefcaseIcon />,
  residence: <MapIcon />,
  mypage: <UserIcon />,
  nickEdit: <TagIcon />,
  pwdEdit: <KeyIcon />,
  infoEdit: <PencilIcon />,
  qnaEdit: <CursorArrowRaysIcon />,
};
