package com.verdantiq.backend;

import com.verdantiq.backend.dto.AuthResponse;
import com.verdantiq.backend.dto.LoginRequest;
import com.verdantiq.backend.dto.RegisterRequest;
import com.verdantiq.backend.model.Role;
import com.verdantiq.backend.model.User;
import com.verdantiq.backend.repository.UserRepository;
import com.verdantiq.backend.security.JwtTokenProvider;
import com.verdantiq.backend.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should successfully register a new user")
    void register_Success() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("newuser@ecosphere.io");
        req.setPassword("Secret123!");
        req.setFullName("Eco User");
        req.setRole(Role.STANDARD_USER);

        when(userRepository.existsByEmail(req.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(req.getPassword())).thenReturn("hashed_pass");
        when(tokenProvider.generateToken(any(), any())).thenReturn("mocked_jwt_token");

        User savedUser = User.builder()
                .id("usr-1")
                .email(req.getEmail())
                .passwordHash("hashed_pass")
                .fullName(req.getFullName())
                .role(Role.STANDARD_USER)
                .build();
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        AuthResponse resp = authService.register(req);

        assertNotNull(resp);
        assertEquals("mocked_jwt_token", resp.getAccessToken());
        assertEquals("newuser@ecosphere.io", resp.getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw exception when registering existing email")
    void register_DuplicateEmail_ThrowsException() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("existing@ecosphere.io");
        req.setPassword("Secret123!");

        when(userRepository.existsByEmail(req.getEmail())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> authService.register(req));
    }

    @Test
    @DisplayName("Should successfully login user with valid credentials")
    void login_Success() {
        LoginRequest req = new LoginRequest();
        req.setEmail("user@ecosphere.io");
        req.setPassword("Secret123!");

        User existingUser = User.builder()
                .id("usr-10")
                .email("user@ecosphere.io")
                .passwordHash("hashed_pass")
                .role(Role.STANDARD_USER)
                .build();

        when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("Secret123!", "hashed_pass")).thenReturn(true);
        when(tokenProvider.generateToken("user@ecosphere.io", "STANDARD_USER")).thenReturn("mocked_login_token");

        AuthResponse resp = authService.login(req);

        assertNotNull(resp);
        assertEquals("mocked_login_token", resp.getAccessToken());
    }

    @Test
    @DisplayName("Should throw exception when login password is invalid")
    void login_InvalidPassword_ThrowsException() {
        LoginRequest req = new LoginRequest();
        req.setEmail("user@ecosphere.io");
        req.setPassword("WrongPassword!");

        User existingUser = User.builder()
                .id("usr-10")
                .email("user@ecosphere.io")
                .passwordHash("hashed_pass")
                .role(Role.STANDARD_USER)
                .build();

        when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("WrongPassword!", "hashed_pass")).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> authService.login(req));
    }
}
