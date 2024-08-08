/** @jsxImportSource @emotion/react */
import { Progress, Typography } from 'oyc-ds';
import React, { useRef, useState } from 'react';
import { descCss } from './style';
import QnA from '../../../components/organisms/QnA';
import { QuestionAnswer } from '../../../apis/avatarApi';
import { IQuestion } from '../../../interfaces/qnaInterface';

interface QuestionProps {
  items: IQuestion[];
  onSubmit: (result: QuestionAnswer[]) => void;
}

const Question = ({ items, onSubmit }: QuestionProps) => {
  const [index, setIndex] = useState<number>(0);
  const answersRef = useRef<QuestionAnswer[]>([]);

  const handleSubmit = (choice: number | null, answer: string | null) => {
    answersRef.current.push({
      questionId: items[index].questionId,
      questionChoiceId: choice,
      subjectiveAns: answer,
    });

    if (index >= items.length - 1) {
      onSubmit(answersRef.current);
      return;
    }

    setIndex((index) => index + 1);
  };

  return (
    <>
      <Typography color="dark">설문조사</Typography>
      <Typography css={descCss}>
        {index >= items.length - 1
          ? '마지막 문항이에요.'
          : `${items.length - index} 문항 남았어요.`}
      </Typography>
      <Progress value={index} max={items.length} size="lg" />
      <QnA
        key={index}
        question={items[index].description}
        choices={items[index].questionChoiceList}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Question;
