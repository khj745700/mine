import { css } from '@emotion/react';

export const userInfoCss = css`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 0.0625rem solid #eeeeee;
`;

export const avatarCss = css`
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  box-shadow: 0 0 0.25rem 0 rgba(0, 0, 0, 0.04);
`;

export const infoContainerCss = css`
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
`;

export const infoCss = css`
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
`;
