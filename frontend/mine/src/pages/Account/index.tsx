/** @jsxImportSource @emotion/react */
import React, { Suspense, useRef, useState } from 'react';
import { Button, Calendar, Chip } from 'oyc-ds';
import Period, { PeriodSelected } from '../../components/molecules/Period';
import { getBetweenDates, getCalendarDate } from '../../utils/dateUtils';
import { ErrorBoundary } from 'react-error-boundary';
import AccountListFetch from './AccountListFetch';
import { accountCss, bottomCss, containerCss, menuCss } from './style';
import Create from './Create';
import useModal from '../../hooks/useModal';
import Error from '../../components/molecules/Error';
import ChipList from '../../components/molecules/ChipList';
import SelectCategory from './SelectCategory';
import { accountCategoryData } from '../../utils/accountUtils';
import {
  getAccounts,
  getAccountsWithCategory,
  getIncomeAccounts,
  getSpendAccounts,
} from '../../apis/accountApi';
import { useQuery } from '@tanstack/react-query';

const Account = () => {
  const periodSelectedRef = useRef<PeriodSelected>('start');
  const [category, setCategory] = useState<number>(0);
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());
  const [calendarPeriod, setCalendarPeriod] = useState<string[]>(['', '']);
  const [selected, setSelected] = useState<string[]>([
    `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
  ]);
  const { push } = useModal();

  console.log(category);

  const { data } = useQuery({
    queryKey: ['account', category, calendarPeriod[0], calendarPeriod[1]],
    queryFn: () => {
      switch (category) {
        case 0:
          return getAccounts(calendarPeriod[0], calendarPeriod[1]);
        case 99:
          return getIncomeAccounts(calendarPeriod[0], calendarPeriod[1]);
        case 100:
          return getSpendAccounts(calendarPeriod[0], calendarPeriod[1]);
        default:
          return getAccountsWithCategory(
            calendarPeriod[0],
            calendarPeriod[1],
            category,
          );
      }
    },
  });

  const [year, month] = start
    .toLocaleDateString()
    .replaceAll('.', '')
    .split(' ')
    .map((value) => parseInt(value));

  const getScheduled = (): string[] => {
    if (!data) {
      return [];
    }

    const set = new Set(
      data.data.map((account) => getCalendarDate(new Date(account.dateTime))),
    );
    return Array.from(set);
  };

  const handleCalendarClick = (year: number, month: number, day: number) => {
    const date = new Date(`${year}-${month}-${day}`);

    let newStart: Date = start,
      newEnd: Date = end;
    if (periodSelectedRef.current === 'start') {
      if (date.getTime() > end.getTime()) {
        newEnd = new Date(date);
        setEnd(newEnd);
      }
      setStart(date);
      setSelected(getBetweenDates(date, newEnd));
      return;
    }

    if (date.getTime() < start.getTime()) {
      newStart = new Date(date);
      setStart(newStart);
    }
    setEnd(date);
    setSelected(getBetweenDates(newStart, date));
  };

  const handleCreateAccount = () => {
    push({
      component: (
        <Create
          selectedDate={start}
          onCreate={(date) => {
            setStart(date);
            setEnd(date);
            setSelected([getCalendarDate(date)]);
          }}
        />
      ),
      name: 'createAccount',
    });
  };

  const handleSelectCategory = () => {
    push({
      component: (
        <SelectCategory
          selected={category}
          onChange={(selected) => {
            setCategory(selected);
          }}
        />
      ),
      name: 'selectAccountCategory',
    });
  };

  const handleCalendarChange = (
    year: number,
    month: number,
    start: string,
    end: string,
  ) => {
    setCalendarPeriod([start, end]);
  };

  return (
    <div css={containerCss}>
      <div>
        <Calendar
          year={year}
          month={month}
          selected={selected}
          scheduled={getScheduled()}
          onClick={handleCalendarClick}
          onChange={handleCalendarChange}
        />
        <div css={menuCss}>
          <Period
            onClick={(selected) => (periodSelectedRef.current = selected)}
            start={start}
            end={end}
          />
          <ChipList onClick={handleSelectCategory}>
            {(category === 0 || category === 99) && (
              <Chip size="sm" fill="#0087ff">
                수입
              </Chip>
            )}
            {(category === 0 || category === 100) && (
              <Chip size="sm" fill="#ff3f3f">
                지출
              </Chip>
            )}
            {category !== 0 && category < 99 && (
              <Chip size="sm" fill="#ff3f3f">
                {accountCategoryData[category].name}
              </Chip>
            )}
          </ChipList>
        </div>
      </div>
      <div css={accountCss}>
        <ErrorBoundary fallbackRender={(props) => <Error {...props} />}>
          <Suspense fallback={<></>}>
            <AccountListFetch
              key={`${start.toLocaleDateString()}-${end.toLocaleDateString()}`}
              start={start}
              end={end}
              category={category}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div css={bottomCss}>
        <Button size="sm" onClick={handleCreateAccount}>
          추가
        </Button>
      </div>
    </div>
  );
};

export default Account;
