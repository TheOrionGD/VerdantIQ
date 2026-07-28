package com.verdantiq.backend.service;

import com.verdantiq.backend.dto.AuthResponse;
import com.verdantiq.backend.dto.LoginRequest;
import com.verdantiq.backend.dto.RegisterRequest;
import com.verdantiq.backend.dto.UserProfileDto;
import com.verdantiq.backend.model.Role;
import com.verdantiq.backend.model.User;
import com.verdantiq.backend.repository.UserRepository;
import com.verdantiq.backend.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("User with email " + request.getEmail() + " already exists.");
        }

        Role assignedRole = request.getRole() != null ? request.getRole() : Role.STANDARD_USER;

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName() != null ? request.getFullName() : request.getEmail().split("@")[0])
                .role(assignedRole)
                .institutionId(request.getInstitutionId())
                .createdAt(Instant.now())
                .build();

        User savedUser = userRepository.save(user);

        String accessToken = tokenProvider.generateToken(savedUser.getEmail(), savedUser.getRole().name());
        String refreshToken = UUID.randomUUID().toString(); // TODO: Implement refresh token database store for revocation

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .role(savedUser.getRole())
                .institutionId(savedUser.getInstitutionId())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        String accessToken = tokenProvider.generateToken(user.getEmail(), user.getRole().name());
        String refreshToken = UUID.randomUUID().toString(); // TODO: Implement refresh token database store for revocation

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .institutionId(user.getInstitutionId())
                .build();
    }

    public UserProfileDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found for email: " + email));

        return UserProfileDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .institutionId(user.getInstitutionId())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public UserProfileDto updateProfile(String email, String fullName, String institutionId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found for email: " + email));

        if (fullName != null && !fullName.isBlank()) {
            user.setFullName(fullName);
        }
        if (institutionId != null) {
            user.setInstitutionId(institutionId);
        }

        User updated = userRepository.save(user);

        return UserProfileDto.builder()
                .id(updated.getId())
                .email(updated.getEmail())
                .fullName(updated.getFullName())
                .role(updated.getRole())
                .institutionId(updated.getInstitutionId())
                .createdAt(updated.getCreatedAt())
                .build();
    }
}
