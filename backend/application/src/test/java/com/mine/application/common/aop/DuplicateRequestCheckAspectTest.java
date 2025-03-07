package com.mine.application.common.aop;

import com.mine.application.common.domain.SessionConstants;
import com.mine.application.common.domain.SessionDao;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.aop.aspectj.annotation.AspectJProxyFactory;

import java.util.Optional;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DuplicateRequestCheckAspectTest {
    private Logger logger = LoggerFactory.getLogger(DuplicateRequestCheckAspectTest.class);

    @Mock
    private SessionDao sessionDao;

    private DuplicateRequestCheckAspect aspect;
    private TestService proxyService;
    private TestService realService;

    @BeforeEach
    public void setup() {
        // 세션 DAO 설정
        lenient().when(sessionDao.get(SessionConstants.USER_ID)).thenReturn(Optional.of(1));

        // Aspect 생성
        aspect = new DuplicateRequestCheckAspect(sessionDao);

        // 테스트 서비스 생성 및 프록시 설정
        realService = new TestService();

        AspectJProxyFactory factory = new AspectJProxyFactory(realService);
        factory.addAspect(aspect);
        proxyService = factory.getProxy();
    }

    @Test
    public void testSingleRequest() {
        // 단일 요청은 성공해야 함
        assertDoesNotThrow(() -> proxyService.lockedMethod());
        assertEquals(1, realService.getCallCount());
    }

    @Test
    public void testDuplicateRequestWithinLockPeriod() throws InterruptedException {
        // 첫 번째 요청
        assertDoesNotThrow(() -> proxyService.lockedMethod());

        // 두 번째 요청 (Lock 기간 내에 요청됨)
        assertThrows(DuplicateRequestException.class, () -> proxyService.lockedMethod());

        // 실제 메소드는 한 번만 호출되어야 함
        assertEquals(1, realService.getCallCount());

        // Lock 기간이 지난 후 다시 시도
        Thread.sleep(1100); // 1000ms(Lock 시간)
        assertDoesNotThrow(() -> proxyService.lockedMethod());
        assertEquals(2, realService.getCallCount());
    }

    @Test
    public void testMultipleUsersRequests() {
        // 첫 번째 사용자
        when(sessionDao.get(SessionConstants.USER_ID)).thenReturn(Optional.of(1));
        assertDoesNotThrow(() -> proxyService.lockedMethod());

        // 두 번째 사용자 (다른 사용자이므로 Lock에 영향을 받지 않아야 함)
        when(sessionDao.get(SessionConstants.USER_ID)).thenReturn(Optional.of(2));
        assertDoesNotThrow(() -> proxyService.lockedMethod());

        // 첫 번째 사용자 다시 시도 (Lock 기간 내이므로 예외 발생)
        when(sessionDao.get(SessionConstants.USER_ID)).thenReturn(Optional.of(1));
        assertThrows(DuplicateRequestException.class, () -> proxyService.lockedMethod());

        assertEquals(2, realService.getCallCount());
    }

    @Test
    public void testDifferentMethods() {
        // 첫 번째 메소드 호출
        assertDoesNotThrow(() -> proxyService.lockedMethod());

        // 두 번째 다른 메소드 호출 (다른 메소드이므로 Lock에 영향을 받지 않아야 함)
        assertDoesNotThrow(() -> proxyService.anotherLockedMethod());

        assertEquals(2, realService.getCallCount());
    }
    @Test
    public void testHighConcurrency() throws InterruptedException {
        int threadCount = 100;
        ExecutorService executorService = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(threadCount);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger exceptionCount = new AtomicInteger(0);

        // Mockito 대신 ThreadLocal을 사용하는 커스텀 SessionDao 구현
        StubSessionDao threadLocalSessionDao = new StubSessionDao();
        DuplicateRequestCheckAspect threadSafeAspect = new DuplicateRequestCheckAspect(threadLocalSessionDao);

        // 테스트 서비스 생성 및 프록시 설정
        TestService threadSafeRealService = new TestService();
        AspectJProxyFactory threadSafeFactory = new AspectJProxyFactory(threadSafeRealService);
        threadSafeFactory.addAspect(threadSafeAspect);
        TestService threadSafeProxyService = threadSafeFactory.getProxy();

        // 다양한 사용자 ID 생성 (0~19, 각 ID별 5개 스레드)
        for (int i = 0; i < threadCount; i++) {
            final int userId = i % 20;
            executorService.submit(() -> {
                try {
                    // 현재 스레드의 userId 설정
                    threadLocalSessionDao.setUserId(userId);
                    threadSafeProxyService.lockedMethod();
                    successCount.incrementAndGet();

                    // 디버깅용 로그 (필요시 활성화)
                    // System.out.println("Success ID: " + userId);
                } catch (DuplicateRequestException e) {
                    exceptionCount.incrementAndGet();
                    // 디버깅용 로그 (필요시 활성화)
                    // System.out.println("Exception ID: " + userId);
                } finally {
                    latch.countDown();
                }
            });
        }
        latch.await();
        assertEquals(20, successCount.get());
        assertEquals(80, exceptionCount.get());
    }

    @Test
    public void testMemoryUsage() throws InterruptedException {
        int userCount = 10000;
        int methodsPerUser = 10;
        // 많은 사용자와 메소드 조합 테스트

        // 테스트 전 GC 실행하여 메모리 상태 초기화
        Runtime runtime = Runtime.getRuntime();
        long beforeMemory = runtime.totalMemory() - runtime.freeMemory();
        logger.info("테스트 전 메모리 사용량: {} MB", beforeMemory / 1024 / 1024);

        for (int i = 0; i < userCount; i++) {
            when(sessionDao.get(SessionConstants.USER_ID)).thenReturn(Optional.of(i));

            for (int j = 0; j < methodsPerUser; j++) {
                try {
                    if (j % 2 == 0) {
                        proxyService.lockedMethod();
                    } else {
                        proxyService.anotherLockedMethod();
                    }
                } catch (DuplicateRequestException ignored) {
                    // 무시
                }
            }
        }

        // 테스트 후 GC 실행하여 메모리 해제 검증

        long afterMemory = runtime.totalMemory() - runtime.freeMemory();
        logger.info("테스트 후 메모리 사용량: {} MB", afterMemory / 1024 / 1024);
        logger.info("테스트로 인한 메모리 증가량: {} MB", (afterMemory - beforeMemory) / 1024 / 1024);

        afterMemory = runtime.totalMemory() - runtime.freeMemory();
        logger.info("30초 후 메모리 사용량: {} MB", afterMemory / 1024 / 1024);

    }

    @Test
    public void testPerformance() throws InterruptedException {
        int iterations = 1000000;
        long startTime = System.currentTimeMillis();
        CountDownLatch latch = new CountDownLatch(iterations);
        StubSessionDao threadLocalSessionDao = new StubSessionDao();
        threadLocalSessionDao.setUserId(1);

        DuplicateRequestCheckAspect threadSafeAspect = new DuplicateRequestCheckAspect(threadLocalSessionDao);
        TestService threadSafeRealService = new TestService();
        AspectJProxyFactory threadSafeFactory = new AspectJProxyFactory(threadSafeRealService);
        threadSafeFactory.addAspect(threadSafeAspect);

        TestService threadSafeProxyService = threadSafeFactory.getProxy();

        Runtime runtime = Runtime.getRuntime();
        long beforeMemory = runtime.totalMemory() - runtime.freeMemory();
        logger.info("테스트 전 메모리 사용량: {} MB", beforeMemory / 1024 / 1024);

        AtomicInteger successCount = new AtomicInteger(0);

        ExecutorService executorService = Executors.newVirtualThreadPerTaskExecutor();
        for (int i = 0; i < iterations; i++) {
            int finalI = i;
            executorService.submit(() -> {
                threadLocalSessionDao.setUserId(finalI % 100);
                try {
                    threadSafeProxyService.lockedMethod();
                    successCount.incrementAndGet();
                }catch (DuplicateRequestException e) {
                }
                latch.countDown();
            });
        }
        latch.await();
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;

        Thread.sleep(10000);

        logger.info("평균 수행 시간: {} ms", (float) duration / iterations);



        long afterMemory = runtime.totalMemory() - runtime.freeMemory();
        runtime.gc();
        logger.info("테스트 후 메모리 사용량: {} MB", afterMemory / 1024 / 1024);
        logger.info("테스트로 인한 메모리 증가량: {} MB", (afterMemory - beforeMemory) / 1024 / 1024);
        assertEquals(200, successCount.get());




        runtime.gc();
        afterMemory = runtime.totalMemory() - runtime.freeMemory();
        logger.info("5초 후 메모리 사용량: {} MB", afterMemory / 1024 / 1024);
    }

    // 테스트용 서비스 클래스
    public static class TestService {
        private AtomicInteger callCount = new AtomicInteger(0);

        @Lock(milli = 1000)
        public void lockedMethod() {
            callCount.incrementAndGet();
        }

        @Lock(milli = 1000)
        public void anotherLockedMethod() {
            callCount.incrementAndGet();

        }

        public int getCallCount() {
            return callCount.get();
        }
    }


    private static class StubSessionDao extends SessionDao {
        ThreadLocal<Integer> val = new ThreadLocal<>();

        @Override
        public Optional<Object> get(SessionConstants key) {
            return Optional.ofNullable(val.get());
        }

        public void setUserId(Integer userId) {
            val.set(userId);
        }
    }
}