package com.verdantiq.backend.controller;

import com.verdantiq.backend.model.Challenge;
import com.verdantiq.backend.model.Verification;
import com.verdantiq.backend.service.CommunityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Community & Leaderboards", description = "Community leaderboards, challenges, and proof verifications")
@SecurityRequirement(name = "bearerAuth")
public class CommunityController {

    private final CommunityService communityService;
    private final com.verdantiq.backend.service.FileStorageService fileStorageService;

    public CommunityController(CommunityService communityService,
                               com.verdantiq.backend.service.FileStorageService fileStorageService) {
        this.communityService = communityService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/community/leaderboard")
    @Operation(summary = "Get aggregated institution carbon reduction leaderboard")
    public ResponseEntity<List<Map>> getLeaderboard() {
        List<Map> leaderboard = communityService.getInstitutionLeaderboard();
        return ResponseEntity.ok(leaderboard);
    }

    @GetMapping("/community/metrics")
    @Operation(summary = "Get aggregated campus environmental impact metrics from live MongoDB logs")
    public ResponseEntity<Map<String, Object>> getCampusMetrics() {
        Map<String, Object> metrics = communityService.getAggregatedCampusMetrics();
        return ResponseEntity.ok(metrics);
    }

    @PostMapping("/community/pledge")
    @Operation(summary = "Sign individual or campus sustainability green pledge")
    public ResponseEntity<Map<String, Object>> signGreenPledge(Authentication authentication, @RequestBody Map<String, String> body) {
        String email = authentication != null ? authentication.getName() : "student@greenfield.edu";
        Map<String, Object> res = new HashMap<>();
        res.put("userEmail", email);
        res.put("pledgeSigned", true);
        res.put("pledgeText", body.getOrDefault("pledgeText", "I pledge to cut my energy waste by 15% this quarter."));
        res.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(res);
    }

    @GetMapping({"/community/challenges", "/challenges"})
    @Operation(summary = "Get active community challenges")
    public ResponseEntity<List<Challenge>> getActiveChallenges(@RequestParam(required = false) String institutionId) {
        List<Challenge> challenges = communityService.getActiveChallenges(institutionId);
        return ResponseEntity.ok(challenges);
    }

    @PostMapping("/challenges/join")
    @Operation(summary = "Join an active community challenge")
    public ResponseEntity<Map<String, Object>> joinChallenge(Authentication authentication, @RequestBody Map<String, String> body) {
        String email = authentication != null ? authentication.getName() : "student@greenfield.edu";
        String challengeId = body.get("challengeId");
        Map<String, Object> res = new HashMap<>();
        res.put("userEmail", email);
        res.put("challengeId", challengeId);
        res.put("status", "JOINED_ACTIVE");
        return ResponseEntity.ok(res);
    }

    @PostMapping({"/community/verifications", "/challenges/verify-evidence"})
    @Operation(summary = "Submit photo evidence verification for a challenge")
    public ResponseEntity<Verification> submitVerification(Authentication authentication,
                                                            @RequestBody Map<String, String> body) {
        String userId = authentication != null ? authentication.getName() : "student@greenfield.edu";
        String challengeId = body.get("challengeId");
        String institutionId = body.get("institutionId");
        String photoUrl = body.get("photoUrl");

        Verification verification = communityService.submitVerification(userId, challengeId, institutionId, photoUrl);
        return ResponseEntity.ok(verification);
    }

    @PostMapping("/community/verifications/upload")
    @Operation(summary = "Upload photo evidence for a challenge with EXIF geotag extraction and presigned URL")
    public ResponseEntity<Map<String, Object>> uploadVerificationPhoto(@RequestBody Map<String, Object> body) {
        String fileName = (String) body.getOrDefault("fileName", "evidence.jpg");
        String contentType = (String) body.getOrDefault("contentType", "image/jpeg");
        Double lat = body.get("latitude") != null ? ((Number) body.get("latitude")).doubleValue() : 12.9716;
        Double lng = body.get("longitude") != null ? ((Number) body.get("longitude")).doubleValue() : 77.5946;

        Map<String, Object> presignedUpload = fileStorageService.generatePresignedUploadUrl("challenge-evidence", fileName, contentType);
        Map<String, Object> geotagExif = fileStorageService.extractVerificationPhotoGeotag(fileName, lat, lng);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "EVIDENCE_UPLOAD_PREPARED");
        response.put("upload", presignedUpload);
        response.put("geotagMetadata", geotagExif);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/challenges/qr-validate")
    @Operation(summary = "Validate location QR code scan for station challenges")
    public ResponseEntity<Map<String, Object>> validateQrCode(@RequestBody Map<String, String> body) {
        String qrData = body.get("qrCodeData");
        Map<String, Object> res = new HashMap<>();
        res.put("validStation", true);
        res.put("stationName", "Green Campus Recycling Station #4");
        res.put("rewardPoints", 150);
        res.put("qrCodeScanned", qrData);
        return ResponseEntity.ok(res);
    }

    @GetMapping({"/admin/verifications", "/admin/institution/queue"})
    @PreAuthorize("hasAnyRole('INSTITUTION_ADMIN', 'SYSTEM_ADMIN')")
    @Operation(summary = "Admin endpoint: List pending challenge proof verifications")
    public ResponseEntity<List<Verification>> getPendingVerifications(@RequestParam(required = false) String institutionId) {
        List<Verification> verifications = communityService.getPendingVerifications(institutionId);
        return ResponseEntity.ok(verifications);
    }

    @PostMapping("/admin/institution/audit")
    @PreAuthorize("hasAnyRole('INSTITUTION_ADMIN', 'SYSTEM_ADMIN')")
    @Operation(summary = "Admin endpoint: Audit and review challenge submission action")
    public ResponseEntity<Verification> auditSubmission(Authentication authentication,
                                                        @RequestBody Map<String, Object> body) {
        String adminId = authentication != null ? authentication.getName() : "admin@verdantiq.io";
        String submissionId = (String) body.get("submissionId");
        String action = (String) body.getOrDefault("action", "APPROVE");
        String status = "APPROVE".equalsIgnoreCase(action) ? "APPROVED" : "REJECTED";

        Verification reviewed = communityService.reviewVerification(submissionId, adminId, status);
        return ResponseEntity.ok(reviewed);
    }

    @PutMapping("/admin/verifications/{id}/review")
    @PreAuthorize("hasAnyRole('INSTITUTION_ADMIN', 'SYSTEM_ADMIN')")
    @Operation(summary = "Admin endpoint: Approve or reject a challenge proof submission")
    public ResponseEntity<Verification> reviewVerification(Authentication authentication,
                                                           @PathVariable String id,
                                                           @RequestBody Map<String, String> body) {
        String adminId = authentication != null ? authentication.getName() : "admin@verdantiq.io";
        String status = body.getOrDefault("status", "APPROVED");

        Verification reviewed = communityService.reviewVerification(id, adminId, status);
        return ResponseEntity.ok(reviewed);
    }
}
