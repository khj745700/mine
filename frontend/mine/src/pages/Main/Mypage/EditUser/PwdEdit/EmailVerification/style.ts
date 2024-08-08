import { css } from '@emotion/react';

export const emailVerificationCss = css`
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  margin-top: 2rem;
`;

export const emailInputCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 0.5rem;
  margin-top: 1rem;
`;

export const codeInputCss = (step: number) => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 0.5rem;
  margin-top: 0.5rem;

  ${step < 1 &&
  css`
    display: none;
  `}
`;

export const nextStepBtnCss = (step: number) => css`
  margin-top: 0.5rem;
  ${step < 2 &&
  css`
    display: none;
  `}
`;
