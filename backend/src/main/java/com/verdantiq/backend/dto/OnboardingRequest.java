package com.verdantiq.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OnboardingRequest {

    @Min(value = 1, message = "Household size must be at least 1")
    private int householdSize;

    @NotBlank(message = "Diet type is required")
    private String dietType; // VEGAN, VEGETARIAN, OMNIVORE, HIGH_MEAT

    private double utilityBillAvgMonthly;

    @NotBlank(message = "Primary transit mode is required")
    private String primaryTransitMode; // GAS_CAR, HYBRID, EV, PUBLIC_TRANSIT, BICYCLE_WALK
}
