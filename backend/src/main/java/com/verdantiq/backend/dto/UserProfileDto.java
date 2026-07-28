package com.verdantiq.backend.dto;

import com.verdantiq.backend.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private String id;
    private String email;
    private String fullName;
    private Role role;
    private String institutionId;
    private Instant createdAt;
}
