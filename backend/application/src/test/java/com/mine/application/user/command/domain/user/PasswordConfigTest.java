package com.mine.application.user.command.domain.user;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = {PasswordConfig.class})
class PasswordConfigTest {

    @Autowired
    private PasswordConfig passwordConfig;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void shouldCreateBCryptPasswordEncoder() {
        // When - Spring context loaded

        // Then
        assertNotNull(passwordEncoder);
        assertTrue(passwordEncoder instanceof BCryptPasswordEncoder);
    }

    @Test
    void passwordConverterInitializer_shouldSetPasswordEncoder() throws Exception {
        // Given
        InitializingBean initializer = passwordConfig.passwordConverterInitializer();

        try (MockedStatic<PasswordConverter> mockedConverter = Mockito.mockStatic(PasswordConverter.class)) {

            // When
            initializer.afterPropertiesSet();

            // Then
            mockedConverter.verify(() ->
                    PasswordConverter.setPasswordEncoder(any(PasswordEncoder.class)), times(1));
        }
    }

    @Test
    void passwordMatcherInitializer_shouldSetPasswordEncoder() throws Exception {
        // Given
        InitializingBean initializer = passwordConfig.passwordMatcherInitializer();

        try (MockedStatic<PasswordMatcher> mockedMatcher = Mockito.mockStatic(PasswordMatcher.class)) {

            // When
            initializer.afterPropertiesSet();

            // Then
            mockedMatcher.verify(() ->
                    PasswordMatcher.setPasswordEncoder(any(PasswordEncoder.class)), times(1));
        }
    }

    @Test
    void integrationTest_passwordEncoderShouldBeSetCorrectly() throws Exception {
        // Given
        PasswordEncoder originalEncoder = null;
        PasswordEncoder originalMatcherEncoder = null;

        try {
            java.lang.reflect.Field converterField = PasswordConverter.class.getDeclaredField("encoder");
            converterField.setAccessible(true);
            originalEncoder = (PasswordEncoder) converterField.get(null);

            java.lang.reflect.Field matcherField = PasswordMatcher.class.getDeclaredField("encoder");
            matcherField.setAccessible(true);
            originalMatcherEncoder = (PasswordEncoder) matcherField.get(null);
        } catch (Exception ignored) {

        }

        try {
            // When - nullify first
            setStaticField(PasswordConverter.class, "encoder", null);
            setStaticField(PasswordMatcher.class, "encoder", null);

            passwordConfig.passwordConverterInitializer().afterPropertiesSet();
            passwordConfig.passwordMatcherInitializer().afterPropertiesSet();

            // Then - verify encoders are set and are BCryptPasswordEncoder
            PasswordEncoder converterEncoder = getStaticField(PasswordConverter.class, "encoder");
            PasswordEncoder matcherEncoder = getStaticField(PasswordMatcher.class, "encoder");

            assertNotNull(converterEncoder);
            assertNotNull(matcherEncoder);
            assertTrue(converterEncoder instanceof BCryptPasswordEncoder);
            assertTrue(matcherEncoder instanceof BCryptPasswordEncoder);

        } finally {
            // Restore original state
            setStaticField(PasswordConverter.class, "encoder", originalEncoder);
            setStaticField(PasswordMatcher.class, "encoder", originalMatcherEncoder);
        }
    }

    private static void setStaticField(Class<?> clazz, String fieldName, Object value) throws Exception {
        java.lang.reflect.Field field = clazz.getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(null, value);
    }

    private static <T> T getStaticField(Class<?> clazz, String fieldName) throws Exception {
        java.lang.reflect.Field field = clazz.getDeclaredField(fieldName);
        field.setAccessible(true);
        return (T) field.get(null);
    }
}