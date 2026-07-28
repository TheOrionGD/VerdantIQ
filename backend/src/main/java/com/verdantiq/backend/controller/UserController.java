package com.verdantiq.backend.controller;

import com.verdantiq.backend.dto.UserProfileDto;
import com.verdantiq.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "User Management", description = "User profile retrieval and management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<UserProfileDto> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        UserProfileDto profile = authService.getProfile(email);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile info")
    public ResponseEntity<UserProfileDto> updateCurrentUser(Authentication authentication,
                                                              @RequestBody Map<String, String> updates) {
        String email = authentication.getName();
        String fullName = updates.get("fullName");
        String institutionId = updates.get("institutionId");

        UserProfileDto updated = authService.updateProfile(email, fullName, institutionId);
        return ResponseEntity.ok(updated);
    }
}
