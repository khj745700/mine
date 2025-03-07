package com.mine.application.common.aop;

import com.mine.application.common.domain.SessionConstants;
import com.mine.application.common.domain.SessionDao;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.util.ConcurrentReferenceHashMap;

import java.lang.reflect.Method;

import java.util.concurrent.locks.ReentrantLock;

@Slf4j
@RequiredArgsConstructor
@Component
@Aspect
public class DuplicateRequestCheckAspect {
    private final ConcurrentReferenceHashMap<Integer, ConcurrentReferenceHashMap<String, LastLockInfo>> locks = new ConcurrentReferenceHashMap<>(16, ConcurrentReferenceHashMap.ReferenceType.SOFT);
    private final SessionDao sessionDao;

    @Around("@annotation(com.mine.application.common.aop.Lock)")
    public Object lockCheck(ProceedingJoinPoint joinPoint) throws Throwable {
        Integer nowSession = (Integer) sessionDao.get(SessionConstants.USER_ID).get();
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String methodId = getMethodId(signature);

        Method method = signature.getMethod();
        Lock lockAnnotation = method.getAnnotation(Lock.class);
        Integer milli = lockAnnotation.milli();
        long currentTimeMillis = System.currentTimeMillis();
        LastLockInfo lockInfo;
        ConcurrentReferenceHashMap<String, LastLockInfo> userLocks = locks.computeIfAbsent(nowSession,
                k -> new ConcurrentReferenceHashMap<>(16, ConcurrentReferenceHashMap.ReferenceType.SOFT));
        synchronized (userLocks) {

            lockInfo = userLocks.get(methodId);

            if (lockInfo != null) {
                long expirationTime = lockInfo.lastLockTimeMillis + milli;
                if (currentTimeMillis < expirationTime) {
                    log.error("Request blocked - previous request at {} is still within lock period. User: {}, Method: {}",
                            lockInfo.lastLockTimeMillis, nowSession, methodId);
                    throw new DuplicateRequestException();
                }
            }

            if (lockInfo == null) {
                ReentrantLock newLock = new ReentrantLock();
                lockInfo = new LastLockInfo(newLock, currentTimeMillis);
                userLocks.put(methodId, lockInfo);
            } else {
                lockInfo.lastLockTimeMillis = currentTimeMillis;
            }

        }
        boolean acquired = false;
        try {
            acquired = lockInfo.lock.tryLock();
            if (!acquired) {
                log.warn("Failed to acquire lock for user {} on method {}", nowSession, methodId);
                throw new DuplicateRequestException();
            }

            return joinPoint.proceed();
        } finally {
            if (acquired) {
                lockInfo.lock.unlock();
                log.debug("Released lock for user {} on method {}, will not allow new requests for {} ms",
                        nowSession, methodId, milli);
            }
        }
    }

    private String getMethodId(MethodSignature methodSignature) {
        String declaringTypeName = methodSignature.getDeclaringTypeName();
        String methodName = methodSignature.getName();
        Class<?>[] parameterTypes = methodSignature.getParameterTypes();

        StringBuilder uniqueMethodId = new StringBuilder();
        uniqueMethodId.append(declaringTypeName)
                .append("#")
                .append(methodName)
                .append("(");

        for (int i = 0; i < parameterTypes.length; i++) {
            uniqueMethodId.append(parameterTypes[i].getName());
            if (i < parameterTypes.length - 1) {
                uniqueMethodId.append(",");
            }
        }
        uniqueMethodId.append(")");

        return uniqueMethodId.toString();
    }

    private static class LastLockInfo {
        private ReentrantLock lock;
        private long lastLockTimeMillis;

        LastLockInfo(ReentrantLock lock, long lastLockTimeMillis) {
            this.lock = lock;
            this.lastLockTimeMillis = lastLockTimeMillis;
        }
    }
}