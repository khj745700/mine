/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { Icon } from 'oyc-ds';
import { containerCss, menuBoxCss } from './style';
import IconTypography from '../../molecules/IconTypography/IconTypography';
import { engToIcon } from '../../../utils/EngToIcon';

interface MenuBarProps {
  menu: number;
  setCurMenu: React.Dispatch<React.SetStateAction<number>>;
}

const MenuBar = ({ menu, setCurMenu }: MenuBarProps) => {
  const [labels, setLabels] = useState<string[]>([
    'chatting',
    'home',
    'mypage',
  ]);

  return (
    <div css={containerCss}>
      {labels.map((v: string, i: number) => {
        return (
          <div key={v} css={menuBoxCss}>
            {menu === i ? (
              <IconTypography label={v} color="primary" />
            ) : (
              <Icon color="secondary" onClick={() => setCurMenu(i)}>
                {engToIcon[v]}
              </Icon>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MenuBar;
