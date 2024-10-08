import { css } from '@emotion/react';

export const containerCss = css`
  display: flex;
  flex-direction: column;
  position: relative;
  height: calc(100% - 0.0625rem);
  padding: 0 1rem;
  box-shadow: 0 0 0 0 #eee;
  border-top: 0.0625rem solid #eee;
`;

export const numberdayCss = css`
  text-align: right;
  margin-top: 2rem;
  line-height: 1.75rem;
`;

export const avatarContainerCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100%);
  height: 15rem;
`;

export const contentsCss = css`
  height: 6rem;
  padding: 1.5rem;
  border-radius: 1rem;
  background-color: #fffde7;
`;

export const conversationCss = css`
  position: absolute;
  right: 1rem;
  left: 1rem;
  bottom: 0;
  height: 8rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 1rem;
  flex: 1;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: 1rem;
  background-color: #fffde7;
  overflow-y: scroll;
`;
