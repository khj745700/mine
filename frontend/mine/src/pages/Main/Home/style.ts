import { css } from '@emotion/react';

export const containerCss = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 1rem;
  background-color: #fffcb1;
`;

export const numberdayCss = css`
  text-align: right;
  margin-top: 2rem;
  line-height: 1.75rem;
`;

export const toggleContainerCss = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  column-gap: 1rem;
  margin-top: 1.5rem;
`;

export const avatarContainerCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100%);
  height: 20rem;
`;

export const conversationCss = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 1rem;
  flex: 1;
  width: 100%;
  margin-bottom: 1.5rem;
  border-radius: 1rem;
  background-color: #fffde7;
`;
