/** @jsxImportSource @emotion/react */
import React, { Suspense, useState } from 'react';
import { mainContainerCss } from './style';
import { useLocation } from 'react-router-dom';
import AppBar from '../../components/organisms/AppBar';
import MenuBar from '../../components/organisms/MenuBar';
import MainFetch from './MainFetch';
import Loading from '../../components/molecules/Loading';
import { ErrorBoundary } from 'react-error-boundary';
import Error from '../../components/molecules/Error';

const Main = () => {
  const location = useLocation();
  const [curMenu, setCurMenu] = useState<number>(
    location.state?.step ? location.state.step : 1,
  );

  return (
    <>
      <div css={mainContainerCss}>
        <AppBar
          label={
            curMenu === 0
              ? '채팅방'
              : curMenu === 1
                ? '메인 화면'
                : '마이페이지'
          }
        />
        <ErrorBoundary fallbackRender={(props) => <Error {...props} />}>
          <Suspense fallback={<Loading />}>
            <MainFetch menu={curMenu} />
          </Suspense>
        </ErrorBoundary>
        <MenuBar menu={curMenu} setCurMenu={setCurMenu} />
      </div>
    </>
  );
};

export default Main;
