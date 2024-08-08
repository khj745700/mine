import { IAnswerData } from '../interfaces/qnaInterface';
import { IUserInfo } from '../interfaces/userInterface';
import { api } from './interceptors';

export const getUserInfo = () => {
  return api.get<IUserInfo>('/api/user/info');
};

//-------------------------------------------

/* 사용자 정보 수정 */
export const updateNickname = (newNickname: string) => {
  return api({
    url: '/api/user/info',
    method: 'patch',
    data: {
      nickname: newNickname,
    },
  });
};

/* 이메일 인증코드 전송 */
export const sendCode = (email: string) => {
  return api({
    url: '/api/auth/help/password/request-verification-email-code',
    method: 'post',
    data: {
      email: email,
    },
  });
};

/* 이메일 인증번호 검증 */
export const verifyCode = (email: string, code: string) => {
  return api({
    url: '/api/auth/verify-email-code',
    method: 'post',
    data: {
      email: email,
      number: code,
    },
  });
};

/* 비밀번호 변경 */
export const updatePassword = (password: string) => {
  return api({
    url: '/api/auth/help/password',
    method: 'patch',
    data: {
      password: password,
    },
  });
};

/* 업적 조회 */
export const getUserAchievement = () => {
  return api({
    url: '/api/users/achievements',
    method: 'get',
  });
};

/* 업적 달성 개수 조회 */
export const getAchievedCount = () => {
  return api({
    url: '/api/users/achievements/count',
    method: 'get',
  });
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
