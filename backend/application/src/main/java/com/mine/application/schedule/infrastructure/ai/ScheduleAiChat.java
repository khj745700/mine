package com.mine.application.schedule.infrastructure.ai;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mine.application.account.command.domain.Account;
import com.mine.application.common.erros.errorcode.CommonErrorCode;
import com.mine.application.common.erros.exception.RestApiException;
import com.mine.application.schedule.command.domain.Schedule;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Component
public class ScheduleAiChat {

    private final OpenAiChatModel openAiChatModel;

    private static final ObjectMapper objectMapper =
            new ObjectMapper()
                    .registerModule(new JavaTimeModule())
                    .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    public AddScheduleDto getAddScheduleDtoFromQuery(String query) {
        PromptTemplate promptTemplate = new PromptTemplate(
                """
                현재 시간: {now},
                query: "{query}",
                categoryId: "1: 미정, 2: 여행, 3: 외식, 4: 업무, 5: 약속, 6: 시험, 7: 기타"
                categoryId, startDateTime, endDateTime, title, description, where 가진
                json으로 답변해. json 외에 다른 답변은 주지마.
                'categoryId'는 query를 통해 최대한 유추해서 넣어.
                'startDateTime' 시작 시간으로 초 단위는 0초로.
                'endDateTime' 끝나는 시간으로 초 단위는 0초로.
                'DateTime'들은 현재 시간과 비교해서 넣어.
                'DateTime'들은 "yyyy-MM-dd'T'HH:mm:ss" 형식으로.
                그런데 시간 정보를 알 수 없다면 현재 시간과 똑같이 해.
                'startDateTime'은 'endDateTime'보다 작거나 같아야 해.
                'title'은 null을 넣지마.
                'description'은 query를 간단하게 요약.
                query에서 where을 최대한 유추해서 넣어.
                query에서 where에 대한 정보를 알 수 없다면 null을 넣어.
                """);
        Prompt prompt = promptTemplate.create(Map.of("query", query, "now", LocalDateTime.now().toString()));
        String response = openAiChatModel.call(prompt).getResult().getOutput().getText();

        return convertJsonToObject(formatToJson(response), AddScheduleDto.class);
    }

    public String getJsonFromQuery(String query, List<Schedule> values) {
        String data = convertValuesToJson(values);

        PromptTemplate promptTemplate = new PromptTemplate(
                """
                json: {data},
                질문: '{query}',
                현재시간: {now}
                위의 json 중 질문에 해당하는 데이터들을 json으로만 반환해줘 다른 답변은 하지말고.
                'id'는 'scheduleId'로 바꿔.
                'userId'는 보내지마.
                질문에 시간 관련 부분이 있을때 현재시간을 보고 분석해서 보내.
                관련된 것이 없으면 빈 json으로 보내.
                """);
        Prompt prompt = promptTemplate.create(Map.of(
                "data", data,
                "query", query,
                "now", LocalDateTime.now().toString())
        );
        String response = openAiChatModel.call(prompt).getResult().getOutput().getText();

        return formatToJson(response);
    }

    private String convertValuesToJson(List<Schedule> values) {
        try {
            return objectMapper.writeValueAsString(values);

        } catch (JsonProcessingException e) {
            throw new RestApiException(CommonErrorCode.RESOURCE_NOT_FOUND);
        }
    }

    private <T> T convertJsonToObject(String json, Class<T> valueType) {
        try {
            return objectMapper.readValue(json, valueType);
        } catch (JsonProcessingException e) {
            throw new RestApiException(CommonErrorCode.RESOURCE_NOT_FOUND);
        }
    }

    private String formatToJson(String string) {
        return string.substring(7, string.length() - 3);
    }

}
