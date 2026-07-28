package com.verdantiq.backend.dto;

import com.verdantiq.backend.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private String userId;
    private String email;
    private String fullName;
    private Role role;
    private String institutionId;
}
