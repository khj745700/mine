/** @jsxImportSource @emotion/react */
import React from 'react';
import { Button } from 'oyc-ds';
import { css } from '@emotion/react';
import { IChoice } from '../../../interfaces/qnaInterface';

interface MultipleChoiceProps {
  items: IChoice[];
  selected: number;
  onSelect: (index: number) => void;
}

const containerCss = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0.5rem;
`;

const MultipleChoice = ({ items, selected, onSelect }: MultipleChoiceProps) => {
  return (
    <div css={containerCss}>
      {items.map((item, index) => (
        <Button
          key={item.questionChoiceId}
          color={selected === index ? 'primary' : 'secondary'}
          variant="outlined"
          size="lg"
          onClick={() => onSelect(index)}
        >
          {item.description}
        </Button>
      ))}
    </div>
  );
};

export default MultipleChoice;
