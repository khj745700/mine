import {
  IAchievedCountResponseData,
  IAchievement,
} from '../interfaces/achievementInterface';
import { IAnswerData } from '../interfaces/qnaInterface';
import { IUserInfo } from '../interfaces/userInterface';
import { api } from './interceptors';

export const getUserInfo = () => {
  return api.get<IUserInfo>('/api/user/info');
};

export const updateNickname = (newNickname: string) => {
  return api.patch('/api/user/info', {
    nickname: newNickname,
  });
};

export const sendCode = (email: string) => {
  return api.post('/api/auth/help/password/request-verification-email-code', {
    email: email,
  });
};

export const verifyCode = (email: string, code: string) => {
  return api.post('/api/auth/verify-email-code', {
    email: email,
    number: code,
  });
};

export const updatePassword = (password: string) => {
  return api.patch('/api/auth/help/password', {
    password: password,
  });
};

export const getUserAchievement = () => {
  return api.get<IAchievement[]>('/api/users/achievements');
};

export const getAchievedCount = () => {
  return api.get<IAchievedCountResponseData>('/api/users/achievements/count');
};

/* 아바타 질문 조회 */
export const getQuestions = () => {
  return api({
    url: `/api/question`,
    method: 'get',
  });
};

/* 아바타 질문 응답 조회 */
export const getAnswers = (avatarId: number) => {
  return api({
    url: `/api/avatars/${avatarId}/questions`,
    method: 'get',
  });
};

/* 아바타 질문 재응답 */
export const updateQnA = (avatarId: number, answerDatas: IAnswerData[]) => {
  return api({
    url: `/api/avatars/${avatarId}/questions`,
    method: 'patch',
    data: {
      list: answerDatas,
    },
  });
};
