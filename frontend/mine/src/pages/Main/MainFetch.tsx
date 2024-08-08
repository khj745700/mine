/** @jsxImportSource @emotion/react */
import React from 'react';
import TransitionAnimation from '../../components/common/TransitionAnimation';
import styles from './Main.module.css';
import Chat from './Chat';
import Home from './Home';
import Mypage from './Mypage';
import { useSuspenseQueries } from '@tanstack/react-query';
import { getUserInfo } from '../../apis/mypageApi';
import { getUserAvatars } from '../../apis/avatarApi';
import { contentCss } from './style';

interface MainFetch {
  menu: number;
}

const MainFetch = ({ menu }: MainFetch) => {
  const [userQuery, avatarQuery] = useSuspenseQueries({
    queries: [
      { queryKey: ['userinfo'], queryFn: async () => await getUserInfo() },
      { queryKey: ['avatarinfo'], queryFn: async () => await getUserAvatars() },
    ],
  });
  [userQuery, avatarQuery].some((query) => {
    if (query.error && !query.isFetching) {
      throw query.error;
    }
  });

  return (
    <div css={contentCss}>
      <TransitionAnimation
        data-key={menu.toString()}
        className={{
          normal: styles.fade,
          enter: styles['fade-enter'],
          exit: styles['fade-exit'],
        }}
      >
        <Chat key={0} />
        <Home key={1} />
        <Mypage key={2} />
      </TransitionAnimation>
    </div>
  );
};

export default MainFetch;
