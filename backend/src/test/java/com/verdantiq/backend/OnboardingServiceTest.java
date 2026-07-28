package com.verdantiq.backend;

import com.verdantiq.backend.dto.OnboardingRequest;
import com.verdantiq.backend.model.HouseholdTwin;
import com.verdantiq.backend.model.User;
import com.verdantiq.backend.repository.HouseholdTwinRepository;
import com.verdantiq.backend.repository.UserRepository;
import com.verdantiq.backend.service.OnboardingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class OnboardingServiceTest {

    @Mock
    private HouseholdTwinRepository householdTwinRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private OnboardingService onboardingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should correctly calculate baseline CO2 score from onboarding questionnaire")
    void processOnboarding_Success() {
        String email = "student@greenfield.edu";
        User mockUser = User.builder()
                .id("usr-101")
                .email(email)
                .build();

        OnboardingRequest request = new OnboardingRequest();
        request.setHouseholdSize(2);          // 2 * 300 = 600
        request.setDietType("VEGAN");          // 150
        request.setUtilityBillAvgMonthly(100); // 100 * 2.5 = 250
        request.setPrimaryTransitMode("EV");    // 75
        // Expected total: 600 + 150 + 250 + 75 = 1075.0

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(mockUser));
        when(householdTwinRepository.findByUserId("usr-101")).thenReturn(Optional.empty());
        when(householdTwinRepository.save(any(HouseholdTwin.class))).thenAnswer(i -> i.getArgument(0));

        HouseholdTwin result = onboardingService.processOnboarding(email, request);

        assertNotNull(result);
        assertEquals("usr-101", result.getUserId());
        assertEquals(2, result.getHouseholdSize());
        assertEquals("VEGAN", result.getDietType());
        assertEquals(1075.0, result.getBaselineCo2ScoreKg());
        verify(householdTwinRepository, times(1)).save(any(HouseholdTwin.class));
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException if user does not exist")
    void processOnboarding_UserNotFound_ThrowsException() {
        String email = "nonexistent@ecosphere.io";
        OnboardingRequest request = new OnboardingRequest();

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> onboardingService.processOnboarding(email, request));
    }
}
