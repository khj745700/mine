package com.mine.application.user.command.domain.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PasswordConverterTest {
    @Mock
    private PasswordEncoder passwordEncoder;

    private PasswordConverter converter;

    @BeforeEach
    void setUp() {
        converter = new PasswordConverter();
        PasswordConverter.setPasswordEncoder(passwordEncoder);
    }

    @Test
    void convertToDatabaseColumn_whenPasswordIsNotEncoded_shouldEncodePassword() {
        // Given
        String rawPassword = "myPassword123";
        String encodedPassword = "encodedPassword";
        Password password = Password.of(rawPassword, false);

        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);

        // When
        byte[] result = converter.convertToDatabaseColumn(password);

        // Then
        assertArrayEquals(encodedPassword.getBytes(StandardCharsets.UTF_8), result);
        verify(passwordEncoder, times(1)).encode(rawPassword);
    }

    @Test
    void convertToDatabaseColumn_whenPasswordIsAlreadyEncoded_shouldNotEncodeAgain() {
        // Given
        String encodedPassword = "alreadyEncodedPassword";
        Password password = Password.of(encodedPassword, true);

        // When
        byte[] result = converter.convertToDatabaseColumn(password);

        // Then
        assertArrayEquals(encodedPassword.getBytes(StandardCharsets.UTF_8), result);
        verify(passwordEncoder, never()).encode(any());
    }

    @Test
    void convertToEntityAttribute_shouldReturnEncodedPassword() {
        // Given
        String encodedPassword = "encodedPassword";
        byte[] dbData = encodedPassword.getBytes(StandardCharsets.UTF_8);

        // When
        Password result = converter.convertToEntityAttribute(dbData);

        // Then
        assertEquals(encodedPassword, result.getValue());
        assertTrue(result.isEncoded());
    }

    @Test
    void convertToEntityAttribute_shouldHandleNullValue() {
        // When
        Password result = converter.convertToEntityAttribute(null);

        // Then
        assertNull(result);
    }

    @Test
    void convertToDatabaseColumn_shouldHandleNullValue() {
        // When
        byte[] result = converter.convertToDatabaseColumn(null);

        // Then
        assertNull(result);
    }
}