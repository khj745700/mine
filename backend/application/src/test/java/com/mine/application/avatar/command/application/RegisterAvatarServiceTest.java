package com.mine.application.avatar.command.application;

import com.mine.application.avatar.command.domain.Assistant;
import com.mine.application.avatar.command.domain.Avatar;
import com.mine.application.avatar.command.domain.AvatarRepository;
import com.mine.application.avatar.command.domain.question.QuestionRes;
import com.mine.application.avatar.command.domain.voice.UploadVoiceService;
import com.mine.application.avatar.command.domain.voice.Voice;
import com.mine.application.avatar.infra.AssistantService;
import com.mine.application.common.domain.SessionConstants;
import com.mine.application.common.domain.SessionDao;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;


class RegisterAvatarServiceTest {
    private RegisterAvatarService registerAvatarService;
    private AvatarRepository avatarRepository;
    private QuestionResFactory questionResFactory;
    private UploadVoiceService uploadVoiceService;
    private AssistantService assistantService;
    private SessionDao sessionDao;
    private Integer threadCount = 10;
    @BeforeEach
    void setUp() {
        avatarRepository = Mockito.mock(AvatarRepository.class);
        questionResFactory = Mockito.mock(QuestionResFactory.class);
        uploadVoiceService = Mockito.mock(UploadVoiceService.class);
        assistantService = Mockito.mock(AssistantService.class);
        sessionDao = Mockito.mock(SessionDao.class);
        registerAvatarService = new RegisterAvatarService(avatarRepository, questionResFactory, uploadVoiceService, assistantService, sessionDao);
    }

    @Test
    @DisplayName("사용자는 동시에 등록 요청을 보내면, 하나만 성공해야 한다.")
    void When_Users_Send_Registration_Requests_Simultaneously_Only_One_Should_Succeed() throws InterruptedException {
        // Given

        AtomicInteger counter = new AtomicInteger(0);
        // 세션에서 유저 ID 반환 설정

        when(sessionDao.get(SessionConstants.USER_ID)).thenAnswer(invocationOnMock -> {
            counter.incrementAndGet();
            counter.incrementAndGet();
            return Optional.of(counter.get() / 2);
                });

        // 아바타 수 0
        when(avatarRepository.countAvatarByUserId(anyInt())).thenReturn(0);

        // 테스트용 아바타 요청 객체 생성
        RegisterAvatarRequest request = createTestAvatarRequest();

        // 필요한 모킹 설정
        setupMockBehaviors();

        // 동시성 테스트를 위한 래치 설정
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch finishLatch = new CountDownLatch(threadCount);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);

        // When: 두 스레드에서 동시에 아바타 등록 시도
        List<Thread> threads = createAndStartThreads(request, startLatch, finishLatch,
                successCount, failureCount);

        // 모든 스레드가 준비되면 동시에 시작 신호 보내기
        startLatch.countDown();

        // 모든 스레드가 완료될 때까지 대기
        finishLatch.await();

        // 하나의 요청만 성공해야 함
        assertAll(
                () -> assertEquals(threadCount / 2, successCount.get(), "성공한 요청은 "+ threadCount / 2 + " 개여야 함."),
                () -> assertEquals(threadCount / 2 , failureCount.get(), "실패한 요청은 " + threadCount / 2 + "개 여야 함.")
        );

    }

    /**
     * 테스트용 아바타 요청 객체를 생성합니다.
     */
    private RegisterAvatarRequest createTestAvatarRequest() {
        List<RegisterQuestionResRequest> questionResList = Arrays.asList();

        return RegisterAvatarRequest.builder()
                .avatarName("테스트 아바타")
                .job("개발자")
                .residence("서울")
                .avatarModel("Default")
                .voiceFileList(new ArrayList<>())
                .questionResList(questionResList)
                .avatarModel("unicorn")
                .build();
    }

    /**
     * 테스트에 필요한 모킹 동작을 설정합니다.
     */
    private void setupMockBehaviors() {
        // 더미 아바타 객체 생성
        Avatar savedAvatar = Avatar.builder()
                .id(1)
                .userId(1)
                .name("테스트 아바타")
                .build();

        // 각 서비스 메서드의 반환값 설정
        when(uploadVoiceService.generateVoice(anyList())).thenReturn(new Voice());
        when(avatarRepository.save(any(Avatar.class))).thenReturn(savedAvatar);
        when(avatarRepository.findAvatarByUserIdAndNotAvatarId(anyInt(), anyInt()))
                .thenReturn(Optional.empty());

        // QuestionResFactory는 항상 새 QuestionRes 객체 반환
        when(questionResFactory.createEntity(any(RegisterQuestionResRequest.class)))
                .thenReturn(new QuestionRes());

        // AssistantService는 항상 새 Assistant 객체 반환
        when(assistantService.generateAssistant(any(Avatar.class)))
                .thenAnswer(invocationOnMock -> {
                    Thread.sleep(500);
                    return new Assistant();
                });
    }

    /**
     * 동시 실행을 위한 스레드들을 생성하고 시작합니다.
     */
    private List<Thread> createAndStartThreads(
            RegisterAvatarRequest request,
            CountDownLatch startLatch,
            CountDownLatch finishLatch,
            AtomicInteger successCount,
            AtomicInteger failureCount) {

        Runnable registerTask = () -> {
            try {
                startLatch.await(); // 모든 스레드가 동시에 시작하도록 대기
                registerAvatarService.generateAvatar(request);
                successCount.incrementAndGet();
            } catch (Exception e) {
                failureCount.incrementAndGet();
            } finally {
                finishLatch.countDown();
            }
        };

        List<Thread> threads = new ArrayList<>();
        for (int i = 0; i < threadCount; i++) {
            Thread thread = new Thread(registerTask);
            thread.start();
            threads.add(thread);
        }
        return threads;
    }
}