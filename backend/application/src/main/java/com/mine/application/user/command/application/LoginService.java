package com.mine.application.user.command.application;

import com.mine.application.common.domain.SessionConstants;
import com.mine.application.common.domain.SessionDao;
import com.mine.application.common.erros.errorcode.CommonErrorCode;
import com.mine.application.common.erros.exception.RestApiException;
import com.mine.application.user.command.domain.log.LoginLog;
import com.mine.application.user.command.domain.log.LoginLogRepository;
import com.mine.application.user.command.domain.user.Password;
import com.mine.application.user.command.domain.user.User;
import com.mine.application.user.command.domain.user.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class LoginService {
    private static final Logger log = LoggerFactory.getLogger(LoginService.class);
    private final UserRepository userRepository;
    private final LoginLogRepository loginLogRepository;
    private final HttpSession httpSession;
    private final SessionDao sessionDao;

    @Value("${spring.session.expire-seconds}") private Integer expireSeconds;

    public void login(LoginRequest loginRequest) {
        Optional<User> findUser = userRepository.findByEmail(loginRequest.getEmail());
        if (findUser.isPresent()) {
            User user = findUser.get();
            if (user.getPassword().equals(Password.of(loginRequest.getPassword(), false))) {
                sessionDao.put(SessionConstants.EMAIL, loginRequest.getEmail());
                sessionDao.put(SessionConstants.USER_ID, user.getId());

                loginLogRepository.save(new LoginLog(user.getId()));

                return;
            }
        }
        throw new RestApiException(CommonErrorCode.INVALID_PARAMETER);
    }

    public void loginCheck() {
        if (sessionDao.get(SessionConstants.EMAIL).isEmpty()) {
            throw new RestApiException(CommonErrorCode.UNAUTHORIZED);
        }
    }

    public void logout() {
        sessionDao.removeAll();
    }

}
