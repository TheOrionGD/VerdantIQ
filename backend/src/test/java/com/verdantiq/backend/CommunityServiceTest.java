package com.verdantiq.backend;

import com.verdantiq.backend.model.Challenge;
import com.verdantiq.backend.model.Verification;
import com.verdantiq.backend.repository.ChallengeRepository;
import com.verdantiq.backend.repository.InstitutionRepository;
import com.verdantiq.backend.repository.VerificationRepository;
import com.verdantiq.backend.service.CommunityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CommunityServiceTest {

    @Mock
    private MongoTemplate mongoTemplate;

    @Mock
    private ChallengeRepository challengeRepository;

    @Mock
    private VerificationRepository verificationRepository;

    @Mock
    private InstitutionRepository institutionRepository;

    @Mock
    private com.verdantiq.backend.service.NotificationService notificationService;

    @InjectMocks
    private CommunityService communityService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should retrieve active challenges for institution")
    void getActiveChallenges_WithInstitutionId() {
        Challenge c1 = Challenge.builder().id("c-1").title("Plant Trees").active(true).build();
        when(challengeRepository.findByInstitutionIdAndActiveTrue("inst-1")).thenReturn(List.of(c1));

        List<Challenge> result = communityService.getActiveChallenges("inst-1");

        assertEquals(1, result.size());
        assertEquals("Plant Trees", result.get(0).getTitle());
    }

    @Test
    @DisplayName("Should create proof verification in PENDING status")
    void submitVerification_Success() {
        when(verificationRepository.save(any(Verification.class))).thenAnswer(i -> i.getArgument(0));

        Verification v = communityService.submitVerification("usr-1", "c-1", "inst-1", "http://storage.local/proof.jpg");

        assertNotNull(v);
        assertEquals("usr-1", v.getUserId());
        assertEquals("c-1", v.getChallengeId());
        assertEquals("PENDING", v.getStatus());
    }

    @Test
    @DisplayName("Should update verification status on admin review")
    void reviewVerification_Success() {
        Verification existing = Verification.builder()
                .id("ver-1")
                .status("PENDING")
                .build();

        when(verificationRepository.findById("ver-1")).thenReturn(Optional.of(existing));
        when(verificationRepository.save(any(Verification.class))).thenAnswer(i -> i.getArgument(0));

        Verification reviewed = communityService.reviewVerification("ver-1", "admin-user", "APPROVED");

        assertNotNull(reviewed);
        assertEquals("APPROVED", reviewed.getStatus());
        assertEquals("admin-user", reviewed.getReviewedBy());
    }
}
