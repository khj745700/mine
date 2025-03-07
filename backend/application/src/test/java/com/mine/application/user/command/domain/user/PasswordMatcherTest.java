package com.mine.application.user.command.domain.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;


class PasswordMatcherTest {
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        PasswordMatcher.setPasswordEncoder(passwordEncoder);
    }

    @Test
    void if_same_password_returns_true() {
        assertTrue(PasswordMatcher.matches(Password.of("password", true), Password.of("password", true)));
        assertFalse(PasswordMatcher.matches(Password.of("password1", true), Password.of("password2", true)));
    }

    @Test
    void if_not_same_password_returns_true() {
        assertFalse(PasswordMatcher.matches(Password.of("password1", true), Password.of("password2", true)));
    }

    @Test
    void if_encrypted_password_same_returns_true() {
        String encodedPassword = passwordEncoder.encode("password");
        Password password1 = Password.of(encodedPassword, true);
        Password password2 = Password.of(encodedPassword, true);
        assertTrue(PasswordMatcher.matches(password1, password2));
    }

    @Test
    void if_encrypted_password_not_same_returns_true() {
        String encodedPassword1 = passwordEncoder.encode("password1");
        String encodedPassword2 = passwordEncoder.encode("password2");
        Password password1 = Password.of(encodedPassword1, true);
        Password password2 = Password.of(encodedPassword2, true);
        assertFalse(PasswordMatcher.matches(password1, password2));
        assertFalse(PasswordMatcher.matches(password2, password1));
    }


    @Test
    void same_value_password_returns_true() {
        String encodedPassword = passwordEncoder.encode("password");
        Password password1 = Password.of(encodedPassword, true);
        Password password2 = Password.of("password", false);
        assertTrue(PasswordMatcher.matches(password1, password2));
        assertTrue(PasswordMatcher.matches(password2, password1));
    }


}