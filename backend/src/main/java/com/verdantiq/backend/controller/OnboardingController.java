package com.verdantiq.backend.controller;

import com.verdantiq.backend.dto.OnboardingRequest;
import com.verdantiq.backend.model.HouseholdTwin;
import com.verdantiq.backend.service.OnboardingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/onboarding")
@Tag(name = "Onboarding", description = "Initial digital twin footprint onboarding endpoints")
@SecurityRequirement(name = "bearerAuth")
public class OnboardingController {

    private final OnboardingService onboardingService;

    public OnboardingController(OnboardingService onboardingService) {
        this.onboardingService = onboardingService;
    }

    @PostMapping({"", "/baseline"})
    @Operation(summary = "Submit onboarding questionnaire to initialize household CO2 baseline")
    public ResponseEntity<HouseholdTwin> submitOnboarding(Authentication authentication,
                                                            @Valid @RequestBody OnboardingRequest request) {
        String email = authentication != null ? authentication.getName() : "student@greenfield.edu";
        HouseholdTwin twin = onboardingService.processOnboarding(email, request);
        return ResponseEntity.ok(twin);
    }
}
