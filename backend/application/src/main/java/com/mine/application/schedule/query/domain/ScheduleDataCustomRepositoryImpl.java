package com.mine.application.schedule.query.domain;

import static com.mine.application.schedule.query.domain.QScheduleData.scheduleData;

import com.mine.application.schedule.ui.dto.GetScheduleResponse;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Repository
public class ScheduleDataCustomRepositoryImpl implements ScheduleDataCustomRepository {

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public List<GetScheduleResponse> findSchedulesByCategoryIdAndDates(
            Integer userId,
            Integer categoryId,
            LocalDateTime startDateTime,
            LocalDateTime endDateTime)
    {
        return jpaQueryFactory
                .select(Projections.constructor(GetScheduleResponse.class,
                        scheduleData.id,
                        scheduleData.categoryId,
                        scheduleData.startDateTime,
                        scheduleData.endDateTime,
                        scheduleData.title,
                        scheduleData.description,
                        scheduleData.where))
                .from(scheduleData)
                .where(scheduleData.startDateTime.between(startDateTime, endDateTime)
                        .and(scheduleData.userId.eq(userId))
                        .and(categoryIdEq(categoryId)))
                .orderBy(scheduleData.startDateTime.asc(),
                         scheduleData.endDateTime.asc())
                .fetch();
    }

    @Override
    public List<GetScheduleResponse> findSchedulesByContaining(Integer userId, String query) {
        return jpaQueryFactory
                .select(Projections.constructor(GetScheduleResponse.class,
                        scheduleData.id,
                        scheduleData.categoryId,
                        scheduleData.startDateTime,
                        scheduleData.endDateTime,
                        scheduleData.title,
                        scheduleData.description,
                        scheduleData.where))
                .from(scheduleData)
                .where(scheduleData.title.contains(query)
                        .or(scheduleData.description.contains(query))
                        .or(scheduleData.where.contains(query))
                        .and(scheduleData.userId.eq(userId)))
                .orderBy(scheduleData.startDateTime.asc(),
                        scheduleData.endDateTime.asc())
                .fetch();
    }

    private BooleanExpression categoryIdEq(Integer categoryId) {
        return categoryId != null ?
                scheduleData.categoryId.eq(categoryId) : null;
    }

}
