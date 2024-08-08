import { css } from '@emotion/react';

export const containerCss = css`
  display: flex;
  justify-content: space-evenly;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 0.0625rem solid #eeeeee;
`;

export const profileCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 0.5rem;
`;

export const avatarCss = css`
  width: 6rem;
  height: 6rem;
  border: 0.0625rem solid #eeeeee;
  border-radius: 50%;
`;
