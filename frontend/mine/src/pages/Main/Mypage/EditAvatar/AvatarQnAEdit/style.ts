import { css } from '@emotion/react';

export const avatarQnAEditContainerCss = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const titleCss = css`
  margin: 1rem 0 1rem 1rem;
`;

export const questionCss = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  padding: 0 1rem;
  margin-top: 1rem;
`;

export const controlBtnCss = css`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

export const editBtnCss = css`
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
  row-gap: 0.75rem;
  padding-bottom: 1rem;
  flex: 1;
`;

export const editListCss = (editTargetLength: number) => css`
  display: ${editTargetLength === 0 ? 'none' : 'flex'};
  justify-content: center;
  align-items: center;
  column-gap: 0.25rem;
`;
