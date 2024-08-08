/** @jsxImportSource @emotion/react */
import React, { Suspense } from 'react';
import AppBar from '../../../../../components/organisms/AppBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { avatarQnAEditContainerCss, questionCss, titleCss } from './style';
import { Typography } from 'oyc-ds';
import AvatarQnAEditFetch from './AvatarQnAEditFetch';
import { ErrorBoundary } from 'react-error-boundary';

const AvatarQnAEdit = () => {
  const location = useLocation();
  const nav = useNavigate();

  return (
    <>
      <div css={avatarQnAEditContainerCss}>
        <AppBar
          label={location.state.data.avatarName}
          onBackClick={() => nav(-1)}
        />
        <div css={titleCss}>
          <Typography size="md" color="dark">
            QnA
          </Typography>
        </div>
        <div css={questionCss}>
          <ErrorBoundary fallback={<>에러</>}>
            <Suspense fallback={<>로딩중</>}>
              <AvatarQnAEditFetch avatarId={location.state.data.avatarId} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
};

export default AvatarQnAEdit;
