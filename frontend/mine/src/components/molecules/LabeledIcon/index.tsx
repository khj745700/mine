/** @jsxImportSource @emotion/react */
import React from 'react';
import { labeledIconContainerCss } from './style';
import { engToIcon } from '../../../utils/EngToIcon';
import { Icon, Typography } from 'oyc-ds';

interface LabeledIconProps {
  label: string;
  content: string;
}

const LabeledIcon = ({ label, content }: LabeledIconProps) => {
  return (
    <div css={labeledIconContainerCss}>
      <Icon>{engToIcon[label]}</Icon>
      <Typography size="sm" color="dark">
        {content}
      </Typography>
    </div>
  );
};

export default LabeledIcon;
