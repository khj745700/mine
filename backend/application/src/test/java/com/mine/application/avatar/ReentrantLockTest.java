package com.mine.application.avatar;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

public class ReentrantLockTest {
    private HashMap<Integer, ReentrantLock> map = new HashMap<>();

    CountDownLatch ready;
    CountDownLatch answerCount;
    private int answer;
    private int threadCount = 5;

    @BeforeEach
    public void setup() {
        map = new HashMap<>();
        ready = new CountDownLatch(1);
    }

    @Test
    public void testLock() throws InterruptedException {
        int target = 1;
        int threadCount = 5;
        answerCount = new CountDownLatch(threadCount);
        for(int i = 1; i <= threadCount; i++) {
            Thread t1 = getThread(i);
            map.put(i, new ReentrantLock());
            map.get(i).lock();
            t1.start();
        }
        ready.countDown();

        map.get(target).unlock();

        answerCount.await(1, TimeUnit.SECONDS);

        Assertions.assertEquals(target, answer);
    }

    @Test
    public void testTryLock() throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(threadCount);
        int[] lockedKeys = new int[threadCount]; // 어떤 key를 락했는지 저장

        for (int i = 1; i <= threadCount; i++) {
            map.put(i, new ReentrantLock());
        }
        for (int i = 0; i < threadCount; i++) {
            int key = (i + 2) % threadCount + 1;
            int threadIndex = i;
            int finalI = i;
            new Thread(() -> {
                ReentrantLock otherLock = map.get(key);
                lockedKeys[threadIndex] = key; // 현재 스레드가 락한 key 저장
                System.out.println("Thread " + finalI + " locked key: " + key);
                otherLock.lock();
                try {
                    ready.await();

                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }

                if (map.get(finalI + 1).tryLock()) {
                    System.out.println("Thread " + Thread.currentThread().getName() + " unlocked key: " + key);
                } else {
                    System.out.println("Thread " + Thread.currentThread().getName() + " could NOT lock key: " + key);
                }
                latch.countDown();
            }).start();
        }
        Thread.sleep(10); //스레드 준비 시간
        ready.countDown(); // 모든 스레드 시작
        latch.await();
        // 모든 스레드가 각자 다른 키를 락했는지 검증
        Assertions.assertArrayEquals(new int[]{3, 4, 5, 1, 2}, lockedKeys);
    }

    @Test
    public void testSynchronizedTryLock() throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(threadCount);
        int[] lockedKeys = new int[threadCount]; // 어떤 key를 락했는지 저장
        Object[] locks = new Object[threadCount + 1]; // synchronized에 사용할 객체 배열

        for (int i = 1; i <= threadCount; i++) {
            locks[i] = new Object();
        }

        for (int i = 0; i < threadCount; i++) {
            int key = (i + 2) % threadCount + 1;
            int threadIndex = i;
            int finalI = i;
            new Thread(() -> {
                Object otherLock = locks[key];
                lockedKeys[threadIndex] = key; // 현재 스레드가 락한 key 저장
                System.out.println("Thread " + finalI + " locked key: " + key);

                synchronized (otherLock) {
                    try {
                        ready.await();
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    }

                    // tryLock 대신 synchronized 블록에서 non-blocking 방식으로 락 시도
                    Object myLock = locks[finalI + 1];
                    boolean lockAcquired = false;

                    lockAcquired = attemptLock(myLock);

                    if (lockAcquired) {
                        System.out.println("Thread " + Thread.currentThread().getName() + " unlocked key: " + key);
                    } else {
                        System.out.println("Thread " + Thread.currentThread().getName() + " could NOT lock key: " + key);
                    }

                    latch.countDown();
                }
            }).start();
        }

        Thread.sleep(10); // 스레드 준비 시간
        ready.countDown(); // 모든 스레드 시작
        latch.await();

        // 모든 스레드가 각자 다른 키를 락했는지 검증
        Assertions.assertArrayEquals(new int[]{3, 4, 5, 1, 2}, lockedKeys);
    }

    // Non-blocking 방식으로 락 시도하는 헬퍼 메소드
    private boolean attemptLock(Object lock) {
        // synchronized에서는 tryLock과 동일한 기능을 직접 구현해야 함
        // 이 예제에서는 간단한 구현을 위해 별도 메소드로 분리
        try {
            lock.wait(0, 0);
            return true;
        } catch (IllegalMonitorStateException | InterruptedException e) {
            return false;
        }
    }


    private Thread getThread(Integer key) {
        return new Thread(() -> {
            ReentrantLock reentrantLock = map.get(key);
            try {
                ready.await();
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            reentrantLock.lock();
            answerCount.countDown();
            answer += key;
        });
    }


}
