/** @jsxImportSource @emotion/react */
import React from 'react';
import { useSuspenseQueries } from '@tanstack/react-query';
import {
  getAchievedCount,
  getUserAchievement,
} from '../../../../apis/mypageApi';
import { achievementListBox } from './style';
import AchievementBox from './AchievementBox';
import { Button } from 'oyc-ds';
import { useNavigate } from 'react-router-dom';
import { IAchievement } from '../../../../interfaces/achievementInterface';

const AchievementFetch = () => {
  const nav = useNavigate();

  const [achievementQuery, achievedCountQuery] = useSuspenseQueries({
    queries: [
      {
        queryKey: ['achievement'],
        queryFn: async () => await getUserAchievement(),
      },
      {
        queryKey: ['achievedcount'],
        queryFn: async () => await getAchievedCount(),
      },
    ],
  });

  [achievementQuery, achievedCountQuery].some((query) => {
    if (query.error && !query.isFetching) {
      throw query.error;
    }
  });

  return (
    <>
      <div css={achievementListBox}>
        {achievementQuery.data.data.map((info: IAchievement) => {
          return (
            <AchievementBox
              key={info.achievementId}
              info={info}
              disabled={
                info.achievementId < 5
                  ? false
                  : info.count === info.amount
                    ? false
                    : true
              }
            />
          );
        })}
      </div>
      <Button
        disabled={achievedCountQuery.data.data.count !== 7}
        style={{ marginTop: '2rem' }}
        onClick={() => nav('/avatar/create')}
      >
        아바타 생성
      </Button>
    </>
  );
};

export default AchievementFetch;
