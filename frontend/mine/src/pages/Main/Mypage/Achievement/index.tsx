/** @jsxImportSource @emotion/react */
import React, { Suspense } from 'react';
import { achievementTitle } from './style';
import { ErrorBoundary } from 'react-error-boundary';
import AchievementFetch from './AchievementFetch';
import AppBar from '../../../../components/organisms/AppBar';
import { useNavigate } from 'react-router-dom';

const Achievement = () => {
  const nav = useNavigate();
  return (
    <>
      <div css={achievementTitle}>
        <AppBar
          label={'업적'}
          onBackClick={() => nav('/', { state: { step: 2 } })}
        />
        <ErrorBoundary fallback={<>에러</>}>
          <Suspense fallback={<>로딩중</>}>
            <AchievementFetch />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default Achievement;
