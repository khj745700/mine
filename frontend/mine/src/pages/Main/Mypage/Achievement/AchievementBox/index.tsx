/** @jsxImportSource @emotion/react */
import React from 'react';
import {
  achievementBoxCss,
  achieveInfoCss,
  achievedDataCss,
  achievementProgressCss,
  progressBarBoxCss,
  progressBarCss,
  achievedCss,
  achievedInfoCss,
} from './style';
import { BackDrop, Icon, Typography } from 'oyc-ds';
import { css } from '@emotion/react';
import { AcademicCapIcon } from '@heroicons/react/24/solid';
import dayjs from 'dayjs';
import { IAchievement } from '../../../../../interfaces/achievementInterface';

interface AchievementBoxProps {
  info: IAchievement;
  disabled: boolean;
}
const AchievementBox = ({ info, disabled }: AchievementBoxProps) => {
  return (
    <div css={achievementBoxCss} style={{ display: disabled ? 'none' : '' }}>
      <BackDrop opacity={0.3} blur={1} css={achievedCss(info.achievedDate)}>
        <div css={achievedInfoCss}>CLEAR</div>
      </BackDrop>
      <div css={achieveInfoCss}>
        <Typography size="md">{info.title}</Typography>
        <div css={achievedDataCss(info.achievedDate)}>
          <Icon color="success">
            <AcademicCapIcon />
          </Icon>
          <Typography size="xs" color="success">
            {info.achievedDate
              ? dayjs(info.achievedDate).format('YYYY-MM-DD')
              : ''}
          </Typography>
        </div>
      </div>
      <Typography
        size="sm"
        color="dark"
        css={() => css`
          text-align: start;
        `}
      >
        {info.description}
      </Typography>
      <div css={achievementProgressCss}>
        <div css={progressBarBoxCss}>
          <div css={progressBarCss(info.amount, info.count)} />
        </div>
        <Typography size="xs" color="dark">
          {(info.count / info.amount) * 100}%
        </Typography>
      </div>
    </div>
  );
};

export default AchievementBox;
