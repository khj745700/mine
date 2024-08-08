import { css } from '@emotion/react';

export const containerCss = (invisible: boolean) => css`
  display: ${invisible ? 'none' : 'block'};
`;

export const btnContainerCss = css`
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  margin-top: 1rem;
`;

export const textfieldCss = css`
  margin-top: 1rem;
`;
