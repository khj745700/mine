export interface IChoice {
  questionChoiceId: number;
  number: number;
  description: string;
}

export interface IQuestion {
  questionId: number;
  num: number;
  description: string;
  type: 'c' | 's';
  questionChoiceList: IChoice[];
}

export interface IAnswer {
  questionResId: number;
  questionId: number;
  questionType: string;
  answer: number | string;
}

export interface INewAnswer {
  questionResId: number;
  questionId: number;
  isNew: boolean;
  newAns: number | string;
}

export interface IAnswerData {
  questionResId: number;
  questionChoiceId: string | number | null;
  subjectiveAns: string | number | null;
}
