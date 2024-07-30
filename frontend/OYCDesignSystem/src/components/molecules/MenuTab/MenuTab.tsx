/** @jsxImportSource @emotion/react */
import React, { useImperativeHandle, useState } from 'react';
import { useTheme } from '@emotion/react';
import { Button } from '../../atoms/Button';
import { MenuTabProps } from './MenuTab.types';
import { tabsCss, btnCss, activeCss, variantCss } from './MenuTab.styles';

export const MenuTab = ({
  children,
  size = 'md',
  variant = 'rounded',
  color = 'primary',
  onChangeMenu,
  ...props
}: MenuTabProps) => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    onChangeMenu(index);
  };

  const tabCount = React.Children.count(children);

  return (
    <div css={[tabsCss, variantCss[variant]]} {...props}>
      <div css={activeCss(activeIndex, theme.colors[color], tabCount)}></div>
      {React.Children.map(children, (child, index) => (
        <Button
          css={btnCss(theme, tabCount, size)}
          onClick={() => handleTabClick(index)}
          size={size}
          color={color}
        >
          {child}
        </Button>
      ))}
    </div>
  );
};
