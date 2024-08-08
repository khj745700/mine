import { css } from '@emotion/react';

export const achievementBoxCss = css`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: start;
  row-gap: 0.5rem;
  width: calc(100% - 2rem);
  margin-top: 1rem;
  padding: 1rem;
  border: 0.0625rem solid #eeeeee;
  border-radius: 0.25rem;
  background-color: white;
`;

export const achieveInfoCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const achievedDataCss = (achievedDate: string | undefined) => css`
  display: ${achievedDate ? 'flex' : 'none'};
  align-items: center;
  column-gap: 0.5rem;
`;

export const achievementProgressCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const progressBarBoxCss = css`
  position: relative;
  width: 80%;
  height: 0.25rem;
  border-radius: 0.125rem;
  background-color: #f1f3f5;
`;

export const progressBarCss = (required_amount: number, count: number) => css`
  position: absolute;
  width: ${(count / required_amount) * 100}%;
  height: 0.25rem;
  border-radius: 0.125rem;
  background-color: #aa00ff;
`;

export const achievedCss = (achievedDate: string | undefined) => css`
  display: ${achievedDate ? 'block' : 'none'};
  left: 0;
  border-radius: 0.25rem;
`;

export const achievedInfoCss = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 0.5rem;
  width: 100%;
  height: 100%;
  color: #fdd835;
  font-weight: 900;
  font-size: 3rem;
  animation-name: scale-down, shake;
  animation-delay: 0s, 1s;
  animation-duration: 1s, 1s;
  animation-timing-function: ease, ease-in-out;
  animation-iteration-count: 1, infinite;
  animation-direction: normal, alternate-reverse;

  @keyframes shake {
    from {
      transform: rotate(5deg);
    }
    to {
      transform: rotate(-5deg);
    }
  }

  @keyframes scale-down {
    from {
      transform: scale(1.5);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

export const achievedIconCss = css``;
