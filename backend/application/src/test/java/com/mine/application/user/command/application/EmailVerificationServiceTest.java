package com.mine.application.user.command.application;

import com.mine.application.common.domain.SessionConstants;
import com.mine.application.common.domain.SessionDao;
import com.mine.application.common.erros.exception.RestApiException;
import com.mine.application.common.event.Events;
import com.mine.application.common.infra.mailsender.MailSenderRequest;
import com.mine.application.user.command.domain.user.Gender;
import com.mine.application.user.command.domain.user.Password;
import com.mine.application.user.command.domain.user.User;
import com.mine.application.user.command.domain.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class EmailVerificationServiceTest {
    private EmailVerificationService emailVerificationService;
    private UserRepository userRepository;
    private SessionDao sessionDao;
    @BeforeEach
    void setUp() {
        userRepository = Mockito.mock(UserRepository.class);
        sessionDao = Mockito.mock(SessionDao.class);
        emailVerificationService = new EmailVerificationService(userRepository, sessionDao);
    }

    @Test
    void email_request_when_email_not_exist() {
        User dummy = new User(Password.of("password", false), "dummy", Gender.of("M"), "dummy@gmail.com");

        when(userRepository.findByEmail(any())).thenReturn(Optional.empty());

        try(MockedStatic<Events> eventsMockedStatic = mockStatic(Events.class)){
            emailVerificationService.emailNumberRequestForNotExist(new EmailVerificationNumRequest());
            eventsMockedStatic.verify(
                    () -> Events.raise(any(MailSenderRequest.class)), times(1)
            );
        }
    }

    @Test
    void email_request_when_email_exist() {
        User dummy = new User(Password.of("password", false), "dummy", Gender.of("M"), "dummy@gmail.com");

        when(userRepository.findByEmail(any())).thenReturn(Optional.of(dummy));

        assertThrows(RestApiException.class, () -> emailVerificationService.emailNumberRequestForNotExist(new EmailVerificationNumRequest()));
    }

    @Test
    void email_request_when_session_same() {
        User dummy = new User(Password.of("password", false), "dummy", Gender.of("M"), "dummy@gmail.com");

        when(sessionDao.get(SessionConstants.EMAIL)).thenReturn(Optional.of(dummy.getEmail()));

        try(MockedStatic<Events> eventsMockedStatic = mockStatic(Events.class)){
            emailVerificationService.emailNumberRequestForSame(new EmailVerificationNumRequest(dummy.getEmail()));
            eventsMockedStatic.verify(
                    () -> Events.raise(any(MailSenderRequest.class)), times(1)
            );
        }

    }

    @Test
    void email_request_when_session_not_same() {
        User dummy = new User(Password.of("password", false), "dummy", Gender.of("M"), "dummy@gmail.com");

        when(sessionDao.get(SessionConstants.EMAIL)).thenReturn(Optional.of("dummy1@gmail.com"));

        assertThrows(RestApiException.class, () -> emailVerificationService.emailNumberRequestForSame(new EmailVerificationNumRequest(dummy.getEmail())));
    }

    @Test
    void verify_email_when_number_equals() {
        EmailVerificationRequest emailVerificationRequest = new EmailVerificationRequest("dummy@gmail.com", "123456");
        UserVerificationEmailDto dto = new UserVerificationEmailDto("dummy@gmail.com", "123456", false);

        when(sessionDao.get(SessionConstants.EMAIL_VERIFICATION)).thenReturn(Optional.of(dto));
        boolean result = emailVerificationService.verifyEmail(emailVerificationRequest);

        assertTrue(result);
    }

    @Test
    void verify_email_when_number_not_equals() {
        EmailVerificationRequest emailVerificationRequest = new EmailVerificationRequest("dummy@gmail.com", "123456");
        UserVerificationEmailDto dto = new UserVerificationEmailDto("dumm1y@gmail.com", "123456", false);

        when(sessionDao.get(SessionConstants.EMAIL_VERIFICATION)).thenReturn(Optional.of(dto));
        boolean result = emailVerificationService.verifyEmail(emailVerificationRequest);

        assertFalse(result);
    }

}