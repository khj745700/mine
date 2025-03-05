package com.mine.application.account.infrastructure.ai;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mine.application.account.command.domain.Account;
import com.mine.application.account.ui.dto.GetSpendAccountStatsResponse;
import com.mine.application.common.erros.errorcode.CommonErrorCode;
import com.mine.application.common.erros.exception.RestApiException;
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
public class AccountAiChat {

    private final OpenAiChatModel openAiChatModel;

    private static final ObjectMapper objectMapper =
            new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    public AddAccountDto getAddAccountDtoFromQuery(String query) {
        PromptTemplate promptTemplate = new PromptTemplate(
                """
                지금시간: {now},
                query: '{query}',
                spendCategoryId: "1: 미정, 2: 여행, 3: 음식, 4: 문화, 5: 의료, 6: 유흥, 7: 미용,
                8: 교통, 9: 생활, 10: 교육, 11: 통신, 12: 경조사, 13: OTT, 14: 주거, 15: 주거"
                spendCategoryId, accountType, money, title, description, dateTime을 가진
                json으로 답변해. json 외에 다른 답변은 하지마.
                'spendCategoryId' query를 통해 최대한 유추해서 넣어.
                'accountType'은 지출이면 S, 수입이면 I.
                'query'에서 'money'를 최대한 정확하게 도출해.
                'money'은 다음 예시와 같이 300만원 -> 3000000.
                'title'은 null을 넣지마.
                'description'은 query를 요약.
                'dateTime'에 관한 정보가 없다면 지금 시간을 줘.
                'datetime'은 "yyyy-MM-dd'T'HH:mm:ss" 형식으로.
                '어제'와 같은 정보가 있다면 분석해.
                그리고 초는 0초로 줘.
                """);
        Prompt prompt = promptTemplate.create(Map.of("query", query, "now", LocalDateTime.now().toString()));
        String response = openAiChatModel.call(prompt).getResult().getOutput().getText();
        System.out.println(response);
        return convertJsonToObject(formatToJson(response), AddAccountDto.class);
    }

    public String getJsonFromQuery(String query, List<Account> values) {
        String data = convertValuesToJson(values);

        PromptTemplate promptTemplate = new PromptTemplate(
                """
                json: {data},
                질문: '{query}',
                현재시간: {now}
                위의 json 중 질문에 해당하는 데이터들을 json으로만 반환해줘 다른 답변은 하지말고.
                'id'는 'accountId'로 바꿔.
                'accountType'은 spend이면 'S' income이면 'I'로 보내.
                'userId'는 보내지마.
                'createdAt'은 보내지마.
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

    public String getSpendAccountAnalysis(
            String period,
            List<GetSpendAccountStatsResponse> currValues,
            List<GetSpendAccountStatsResponse> prevValues
    ) {
        String currData = convertValuesToJson(currValues);
        String prevData = convertValuesToJson(prevValues);

        PromptTemplate promptTemplate = new PromptTemplate(
                """
                이전 {period} 지출: {prevData},
                현재 {period} 지출: {currData},
                1: 미정, 2: 여행, 3: 음식, 4: 문화, 5: 의료,
                6: 유흥, 7: 미용, 8: 교통, 9: 생활, 10: 교육,
                11: 통신, 12: 경조사, 13: OTT, 14: 주거, 15: 기타.
                사용자의 소비패턴에 대해 분석해.
                소비습관을 현실적으로 개선할 수 있는 메시지를 상냥한 말투로 적어.
                마지막에 이모티콘을 반드시 적어.
                메시지는 반드시 100자 이내로 적어.
                이전 지출 대비 현재 지출을 분석해.
                만약 이전 지출이 없다면 현재 지출만으로 분석해.
                만약 현재 지출도 없다면 지출에 짧게 좋은 소비습관을 추천해.
                메시지에 카테고리 숫자는 적지마.
                """);
        Prompt prompt = promptTemplate.create(Map.of(
                "period", period,
                "prevData", prevData,
                "currData", currData
        ));

        return openAiChatModel.call(prompt).getResult().getOutput().getText();
    }

    public String getIncomeAccountAnalysis(
            String period,
            Long currValue,
            Long prevValue
    ) {
        PromptTemplate promptTemplate = new PromptTemplate(
                """
                이전 {period} 수입: {prevValue},
                현재 {period} 수입: {currValue},
                사용자의 수입에 대해 분석해서
                메시지를 상냥한 말투로 적고 마지막에 반드시 이모티콘도 적어.
                이전 수입 대비 현재 수입이 떨어지면 슬픈 감정의 메시지.
                이전 수입 대비 현주 수입이 올랐으면 기쁜 감정의 메시지.
                메시지는 반드시 50자 이내로 적어.
                이전 지출 대비 현재 지출을 분석해.
                만약 이전 수입이 없다면 현재 수입만으로 분석해.
                """);
        Prompt prompt = promptTemplate.create(Map.of(
                "period", period,
                "prevValue", prevValue,
                "currValue", currValue
        ));

        return openAiChatModel.call(prompt).getResult().getOutput().getText();
    }

    private <T> T convertJsonToObject(String json, Class<T> valueType) {
        try {
            return objectMapper.readValue(json, valueType);
        } catch (JsonProcessingException e) {
            throw new RestApiException(CommonErrorCode.RESOURCE_NOT_FOUND);
        }
    }

    private String convertValuesToJson(Object values) {
        try {
            return objectMapper.writeValueAsString(values);

        } catch (JsonProcessingException e) {
            throw new RestApiException(CommonErrorCode.RESOURCE_NOT_FOUND);
        }
    }

    private String formatToJson(String string) {
        return string.substring(7, string.length() - 3);
    }

}
