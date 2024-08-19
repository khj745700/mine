/** @jsxImportSource @emotion/react */
import React, { Suspense, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '../../../components/organisms/AppBar';
import { containerCss, modalCss, resultCss, searchCss } from './style';
import TypeTextField from '../../../components/molecules/TypeTextField';
import { Typography } from 'oyc-ds';
import { ErrorBoundary } from 'react-error-boundary';
import SearchListFetch from './SearchListFetch';
import Loading from '../../../components/molecules/Loading';
import Error from '../../../components/molecules/Error';

export type ScheduleSearchType = 'keyword' | 'ai';

interface SearchData {
  query: string;
  type: ScheduleSearchType;
}

const types: { name: string; value: ScheduleSearchType }[] = [
  { name: 'AI 검색', value: 'ai' },
  { name: '키워드 검색', value: 'keyword' },
];

const tips: Record<ScheduleSearchType, string> = {
  ai: '궁금한 내용을 AI에게 질문하세요.',
  keyword: '일정의 제목, 내용 등 검색할 키워드를 입력하세요.',
};

const Search = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<ScheduleSearchType>('keyword');
  const [search, setSearch] = useState<SearchData>({ query: '', type: type });
  const queryRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.KeyboardEvent | void) => {
    if (!queryRef.current || (e && e.key !== 'Enter')) {
      return;
    }
    setSearch({ query: queryRef.current.value, type });
  };

  return (
    <div css={modalCss}>
      <div css={containerCss}>
        <div>
          <AppBar label="일정 검색" onBackClick={() => navigate(-1)} />
        </div>
        <div>
          <div css={searchCss}>
            <TypeTextField
              types={types}
              ref={queryRef}
              onKeyDown={handleSubmit}
              onTypeChange={(type) => setType(type as ScheduleSearchType)}
              onVoiceInput={handleSubmit}
            />
            <Typography color="secondary" size="xs" weight="medium">
              {tips[type]}
            </Typography>
          </div>
        </div>
        <div css={resultCss}>
          {search.query && (
            <ErrorBoundary fallbackRender={(props) => <Error {...props} />}>
              <Suspense fallback={<Loading />}>
                <SearchListFetch
                  key={JSON.stringify(search)}
                  query={search.query}
                  type={search.type}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
