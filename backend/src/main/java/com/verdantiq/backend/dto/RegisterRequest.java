package com.verdantiq.backend.dto;

import com.verdantiq.backend.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private String fullName;

    private Role role; // Nullable; defaults to STANDARD_USER

    private String institutionId;
}
