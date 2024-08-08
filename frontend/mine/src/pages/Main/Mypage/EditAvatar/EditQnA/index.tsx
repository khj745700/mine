/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography } from 'oyc-ds';
import { btnContainerCss, containerCss, textfieldCss } from './style';
import { IAnswer, IChoice, IQuestion } from '../../../../../types/qnaType';

interface EditQnAProps {
  question: IQuestion;
  answer: IAnswer;
  invisible: boolean;
  qidx: number;
  handleResponse: (Qidx: number, Aidx: number | string) => void;
}

const EditQnA = ({
  question,
  answer,
  invisible,
  qidx,
  handleResponse,
}: EditQnAProps) => {
  const [selected, setSelected] = useState<string | number>(answer.answer);

  useEffect(() => {
    console.log(answer);
  }, []);

  return (
    <>
      <div css={containerCss(invisible)}>
        <Typography size="lg" color="dark">
          {question.description}
        </Typography>
        {question.type === 'c' ? (
          <div css={btnContainerCss}>
            {question.questionChoiceList.map((item: IChoice, idx: number) => {
              return (
                <Button
                  key={item.questionChoiceId}
                  color={selected == idx + 1 ? 'primary' : 'secondary'}
                  variant="outlined"
                  size="lg"
                  onClick={() => {
                    setSelected(idx + 1);
                    handleResponse(qidx, idx);
                  }}
                >
                  {item.description}
                </Button>
              );
            })}
          </div>
        ) : (
          <div css={textfieldCss}>
            <TextField
              label=""
              defaultValue={answer.answer + ''}
              variant="outlined"
              maxRows={5}
              multiLine
              onChange={(e) => handleResponse(qidx, e.target.value)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default EditQnA;
