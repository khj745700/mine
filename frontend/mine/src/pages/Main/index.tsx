/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import MenuBar from '../../components/organisms/MenuBar';
import AppBar from '../../components/organisms/AppBar';
import TransitionAnimation from '../../components/common/TransitionAnimation';
import styles from './Main.module.css';
import Home from './Home';
import { containerCss, contentCss } from './style';
import Chat from './Chat';
import MypageV2 from './Mypage';
import { useLocation } from 'react-router-dom';

const Main = () => {
  const location = useLocation();
  const [curMenu, setCurMenu] = useState<number>(
    location.state?.step ? location.state.step : 1,
  );

  return (
    <>
      <div css={containerCss}>
        <AppBar
          label={
            curMenu === 0
              ? '채팅방'
              : curMenu === 1
                ? '메인 화면'
                : '마이페이지'
          }
        />
        <div css={contentCss}>
          <TransitionAnimation
            data-key={curMenu.toString()}
            className={{
              normal: styles.fade,
              enter: styles['fade-enter'],
              exit: styles['fade-exit'],
            }}
          >
            <Chat key={0} />
            <Home key={1} />
            <MypageV2 key={2} />
          </TransitionAnimation>
        </div>
        <MenuBar page="chat" menu={curMenu} setCurMenu={setCurMenu} />
      </div>
    </>
  );
};

export default Main;
