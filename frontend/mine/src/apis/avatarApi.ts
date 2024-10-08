import axios from 'axios';
import { api } from './interceptors';

export interface QuestionChoice {
  questionChoiceId: number;
  number: number;
  description: string;
}

export interface QuestionData {
  questionId: number;
  num: number;
  description: string;
  type: 'c' | 's';
  questionChoiceList: QuestionChoice[];
}

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

export const getQuestions = () => {
  return api.get<QuestionData[]>('/api/question');
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
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 1,
        similarity_boost: 1,
        style: 1,
        use_speaker_boost: true,
      },
    },
    {
      headers: {
        'xi-api-key': process.env.REACT_APP_TTS_API_KEY,
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

export const updateClickEasterAchievement = () => {
  return api.patch<boolean>('/api/users/achievements/5');
};

//  아직 api가 없음
export const updateSpinEasterAchievement = () => {
  return api.patch<boolean>('/api/users/achievements/6');
};

export const updateChatEasterAchievement = () => {
  return api.patch<boolean>('/api/users/achievements/7');
};
