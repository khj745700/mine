/** @jsxImportSource @emotion/react */
import React, { useCallback } from 'react';
import { useSuspenseQueries } from '@tanstack/react-query';
import {
  getAchievedCount,
  getUserAchievement,
} from '../../../../apis/mypageApi';
import { achievementListBox } from './style';
import AchievementBox from './AchievementBox';
import { Button, Typography } from 'oyc-ds';
import { useNavigate } from 'react-router-dom';
import useDialog from '../../../../hooks/useDialog';

export interface IAchievement {
  achievementId: number;
  title: string;
  description: string;
  amount: number;
  count: number;
  achievedDate?: string;
}

const AchievementFetch = () => {
  const nav = useNavigate();
  const { alert } = useDialog();

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

  const handleClick = useCallback(() => {
    if (achievedCountQuery.data.data.count < 7) {
      alert(
        <div>
          모든 업적을 완료해주세요!
          <br />
          <Typography size="xs" color="secondary">
            숨겨진 업적이 있을지도...
          </Typography>
        </div>,
      );
    } else {
      nav('/avatar/create');
    }
  }, []);

  return (
    <>
      <div css={achievementListBox}>
        {achievementQuery.data.data.map((info: IAchievement) => {
          return (
            <AchievementBox
              key={info.achievementId}
              info={info}
              hide={info.achievementId >= 5 && info.amount !== info.count}
            />
          );
        })}
      </div>
      <Button style={{ margin: '2rem 0' }} onClick={handleClick}>
        아바타 생성
      </Button>
    </>
  );
};

export default AchievementFetch;
