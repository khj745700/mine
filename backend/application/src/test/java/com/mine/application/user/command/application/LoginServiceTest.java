package com.mine.application.user.command.application;

import com.mine.application.common.domain.SessionDao;
import com.mine.application.common.erros.exception.RestApiException;
import com.mine.application.user.command.domain.log.LoginLog;
import com.mine.application.user.command.domain.log.LoginLogRepository;
import com.mine.application.user.command.domain.user.*;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.BDDMockito;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.assertj.core.api.AssertionsForClassTypes.catchThrowable;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class LoginServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private HttpSession httpSession;

    @Mock
    private LoginLogRepository loginLogRepository;

    @Mock
    private SessionDao sessionDao;

    @Nested
    @DisplayName("로그인 성공")
    class Success {

        @Test
        void login() {
            //given
            LoginService loginService = new LoginService(userRepository, loginLogRepository,httpSession, sessionDao);
            User testUser = User.builder()
                    .email("test@test.test")
                    .id(1)
                    .gender(Gender.of("M"))
                    .nickname("테스트 객체")
                    .password(Password.of("testtest1", false))
                    .build();
            given(userRepository.findByEmail("test@test.test")).willReturn(Optional.of(testUser));

            LoginRequest requestParam = new LoginRequest("test@test.test", "testtest1");

            //when
            loginService.login(requestParam);

            //then
            then(loginLogRepository).should(times(1)).save(new LoginLog(testUser.getId()));

        }
    }

    @Nested
    @DisplayName("로그인 실패")
    class Fail {

        @Test
        @DisplayName("아이디 틀림")
        void login_fail_with_unvalid_id() {
            LoginService loginService = new LoginService(userRepository, loginLogRepository, httpSession, sessionDao);
            User testUser = User.builder()
                    .email("test@test.test")
                    .id(1)
                    .gender(Gender.of("M"))
                    .nickname("테스트 객체")
                    .password(Password.of("testtest1", false))
                    .build();
            given(userRepository.findByEmail("test@test.11")).willReturn(Optional.empty());

            assertThatThrownBy(() -> {
                loginService.login(new LoginRequest("test@test.11", "testtest1"));
            }).isInstanceOf(RestApiException.class);


            then(loginLogRepository).shouldHaveNoMoreInteractions();
        }

        @Test
        @DisplayName("비밀번호 틀림")
        void login_fail_with_unvalid_password() {

        }
    }
}
