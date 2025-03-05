package com.mine.application.avatar;

import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class SynchronizedTest {
    private final HashMap<Integer, Object> lockMap = new HashMap<>();

    CountDownLatch ready = new CountDownLatch(1);
    CountDownLatch answerCount;
    private int answer = 0;

    @Test
    void testLock() throws InterruptedException {
        int target = 3;   // 해제할 스레드의 key
        int threadCount = 5;
        answerCount = new CountDownLatch(threadCount);

        for (int i = 1; i <= threadCount; i++) {
            lockMap.put(i, new Object());  // 각 key마다 새로운 객체 생성
            Thread t1 = getThread(i);
            t1.start();
        }
        ready.countDown(); // 모든 스레드 시작

        synchronized (lockMap.get(target)) {
            lockMap.get(target).notify();  // 특정 key의 락을 해제
        }
        answerCount.await(1, TimeUnit.SECONDS);
        assertEquals(target, answer);
    }

    private Thread getThread(Integer key) {
        return new Thread(() -> {
            Object lock = lockMap.get(key);
            try {
                synchronized (lock) {
                    lock.wait();  // 특정 key에 대한 락을 기다림
                    ready.await();  // 모든 스레드 동기화
                    answerCount.countDown();
                    answer += key;
                }
            } catch (InterruptedException e) {

                throw new RuntimeException(e);
            }
        });
    }
}