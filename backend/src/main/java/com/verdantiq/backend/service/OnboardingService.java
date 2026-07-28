package com.verdantiq.backend.service;

import com.verdantiq.backend.dto.OnboardingRequest;
import com.verdantiq.backend.model.HouseholdTwin;
import com.verdantiq.backend.model.User;
import com.verdantiq.backend.repository.HouseholdTwinRepository;
import com.verdantiq.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class OnboardingService {

    private final HouseholdTwinRepository householdTwinRepository;
    private final UserRepository userRepository;

    public OnboardingService(HouseholdTwinRepository householdTwinRepository, UserRepository userRepository) {
        this.householdTwinRepository = householdTwinRepository;
        this.userRepository = userRepository;
    }

    public HouseholdTwin processOnboarding(String email, OnboardingRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        /*
         * Baseline Monthly CO2 Formula Calculation (Approximate parameters):
         * Source/Assumptions: EPA & IPCC average emission factors.
         * 1. Household size factor: 300 kg CO2 / person / month
         * 2. Diet factor: VEGAN (150 kg), VEGETARIAN (220 kg), OMNIVORE (380 kg), HIGH_MEAT (520 kg)
         * 3. Utility bill factor: $1.00 USD avg bill ~ 2.5 kg CO2 emission
         * 4. Transit mode factor: GAS_CAR (300 kg), HYBRID (160 kg), EV (75 kg), PUBLIC_TRANSIT (50 kg), BICYCLE_WALK (0 kg)
         */
        double householdBase = request.getHouseholdSize() * 300.0;

        double dietFactor = switch (request.getDietType().toUpperCase()) {
            case "VEGAN" -> 150.0;
            case "VEGETARIAN" -> 220.0;
            case "HIGH_MEAT" -> 520.0;
            default -> 380.0; // OMNIVORE
        };

        double utilityFactor = request.getUtilityBillAvgMonthly() * 2.5;

        double transitFactor = switch (request.getPrimaryTransitMode().toUpperCase()) {
            case "GAS_CAR" -> 300.0;
            case "HYBRID" -> 160.0;
            case "EV" -> 75.0;
            case "PUBLIC_TRANSIT" -> 50.0;
            default -> 0.0; // BICYCLE_WALK
        };

        double totalBaselineCo2 = householdBase + dietFactor + utilityFactor + transitFactor;

        HouseholdTwin twin = householdTwinRepository.findByUserId(user.getId())
                .orElse(HouseholdTwin.builder().userId(user.getId()).build());

        twin.setHouseholdSize(request.getHouseholdSize());
        twin.setDietType(request.getDietType());
        twin.setUtilityBillAvgMonthly(request.getUtilityBillAvgMonthly());
        twin.setPrimaryTransitMode(request.getPrimaryTransitMode());
        twin.setBaselineCo2ScoreKg(Math.round(totalBaselineCo2 * 100.0) / 100.0);
        twin.setUpdatedAt(Instant.now());

        return householdTwinRepository.save(twin);
    }
}
