import axios from 'axios';
import { api } from './interceptors';
import { IAvatar } from '../interfaces/avatarInterface';
import { IQuestion } from '../interfaces/qnaInterface';

export interface SentenceData {
  sentenceId: number;
  description: string;
}

// <!-- 아바타 생성 관련 타입

export interface AvatarData {
  avatarName: string;
  residence: string;
  job: string;
  avatarModel: string;
}

export interface QuestionAnswer {
  questionId: number;
  questionChoiceId: number | null;
  subjectiveAns: string | null;
}

export interface VoiceFile {
  file: string;
  fileName: string;
  fileExtension: string;
}

export interface CreateAvatarRequest extends AvatarData {
  questionResList: QuestionAnswer[];
  voiceFileList: VoiceFile[];
}

// -->

export interface NewAnsData {
  questionId: number;
  ansId: string | number;
}

export interface NewAnsListData {
  avatarId: number;
  anss: NewAnsData[];
}

export interface AvatarInfoUpdateRequestData {
  avatarId: number;
  infoType: string;
  value: string | boolean;
}

export const getUserAvatars = () => {
  return api.get<IAvatar[]>('/api/avatars');
};

export const updateAvatarInfo = (info: AvatarInfoUpdateRequestData) => {
  return api.patch(`/api/avatars/${info.avatarId}`, {
    [info.infoType]: info.value,
  });
};

export const getQuestions = () => {
  return api.get<IQuestion[]>('/api/question');
};

export const createAvatar = (param: CreateAvatarRequest) => {
  return api.post('/api/avatars', param);
};

/* 아바타 질문 응답 조회 */
export const getAvatarQuestionAnswer = (avatarId: number) => {
  return api({
    url: '/mypage/avatar/questions',
    method: 'get',
  });
};

/* 아바타 설문 조사 변경 */
export const updateAvatarChoice = (newChoices: NewAnsListData) => {
  return api({
    url: '/mypage/avatar/newchoice',
    method: 'patch',
    data: newChoices,
  });
};

/* 아바타 질의 응답 변경 */
export const updateAvatarSubjective = (newSubjectives: NewAnsListData) => {
  return api({
    url: '/mypage/avatar/subjective',
    method: 'patch',
    data: newSubjectives,
  });
};

export const getSTT = (param: {
  avatarId: number;
  file: string;
  chatType: 'c' | 'a' | 's';
}) => {
  return api.post<string>(`/api/avatars/${param.avatarId}/voice`, {
    ...param,
    fileExtension: 'webm',
  });
};

/* 아바타 TTS */
export const avatarTTS = (voiceId: string, text: string) => {
  return axios.post(
    process.env.REACT_APP_TTS_BASE_URL + `/${voiceId}`,
    {
      text: text,
    },
    {
      headers: {
        'xi-api-key': process.env.REACT_API_TTS_API_KEY,
        'Content-Type': 'application/json',
      },
      responseType: 'blob',
    },
  );
};

/* 아바타 생성 업적 갱신 */
export const updateAvatarAchievement = () => {
  return api.patch<boolean>('/api/users/achievements/2');
};
