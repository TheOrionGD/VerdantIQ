package com.verdantiq.backend.service;

import com.verdantiq.backend.model.ActivityLog;
import com.verdantiq.backend.model.Challenge;
import com.verdantiq.backend.model.Institution;
import com.verdantiq.backend.model.Verification;
import com.verdantiq.backend.repository.ChallengeRepository;
import com.verdantiq.backend.repository.InstitutionRepository;
import com.verdantiq.backend.repository.VerificationRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CommunityService {

    private final MongoTemplate mongoTemplate;
    private final ChallengeRepository challengeRepository;
    private final VerificationRepository verificationRepository;
    private final InstitutionRepository institutionRepository;
    private final NotificationService notificationService;

    public CommunityService(MongoTemplate mongoTemplate,
                            ChallengeRepository challengeRepository,
                            VerificationRepository verificationRepository,
                            InstitutionRepository institutionRepository,
                            NotificationService notificationService) {
        this.mongoTemplate = mongoTemplate;
        this.challengeRepository = challengeRepository;
        this.verificationRepository = verificationRepository;
        this.institutionRepository = institutionRepository;
        this.notificationService = notificationService;
    }

    public List<Map> getInstitutionLeaderboard() {
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.group("institutionId")
                        .sum("co2SavedKg").as("totalCo2SavedKg")
                        .count().as("totalActivitiesCount")
                        .avg("co2SavedKg").as("avgCo2SavedPerActivity"),
                Aggregation.sort(Sort.Direction.DESC, "totalCo2SavedKg")
        );

        AggregationResults<Map> results = mongoTemplate.aggregate(agg, ActivityLog.class, Map.class);
        List<Map> leaderboard = new ArrayList<>(results.getMappedResults());

        int rank = 1;
        for (Map entry : leaderboard) {
            entry.put("rank", rank);
            String instId = (String) entry.get("_id");
            if (instId != null) {
                institutionRepository.findById(instId)
                        .ifPresent(inst -> entry.put("institutionName", inst.getName()));
            } else {
                entry.put("institutionName", "Independent Eco Members");
            }

            List<String> badges = new ArrayList<>();
            if (rank == 1) badges.add("Top Carbon Saver");
            if (rank <= 3) badges.add("Eco Pioneer");
            badges.add("Active Campus");
            entry.put("badges", badges);

            rank++;
        }

        return leaderboard;
    }

    public List<Challenge> getActiveChallenges(String institutionId) {
        if (institutionId != null && !institutionId.isBlank()) {
            return challengeRepository.findByInstitutionIdAndActiveTrue(institutionId);
        }
        return challengeRepository.findByActiveTrue();
    }

    public Verification submitVerification(String userId, String challengeId, String institutionId, String photoUrl) {
        Verification verification = Verification.builder()
                .userId(userId)
                .challengeId(challengeId)
                .institutionId(institutionId)
                .photoUrl(photoUrl)
                .status("PENDING")
                .timestamp(java.time.Instant.now())
                .build();

        return verificationRepository.save(verification);
    }

    public Verification reviewVerification(String verificationId, String adminUserId, String status) {
        Verification v = verificationRepository.findById(verificationId)
                .orElseThrow(() -> new IllegalArgumentException("Verification not found: " + verificationId));

        v.setStatus(status.toUpperCase());
        v.setReviewedBy(adminUserId);
        Verification saved = verificationRepository.save(v);

        // Phase 9 Notification Trigger Point
        if (notificationService != null && saved.getUserId() != null) {
            String title = "Challenge Proof " + saved.getStatus();
            String msg = "Your submitted challenge proof was " + saved.getStatus().toLowerCase() + " by campus administrator.";
            notificationService.createNotification(saved.getUserId(), "CHALLENGE_STATUS", title, msg);
        }

        return saved;
    }

    public List<Verification> getPendingVerifications(String institutionId) {
        if (institutionId != null && !institutionId.isBlank()) {
            return verificationRepository.findByInstitutionId(institutionId);
        }
        return verificationRepository.findByStatus("PENDING");
    }

    public Map<String, Object> getAggregatedCampusMetrics() {
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.group()
                        .sum("co2SavedKg").as("totalCo2AvoidedKg")
                        .sum("amount").as("totalAmount")
        );

        AggregationResults<Map> results = mongoTemplate.aggregate(agg, ActivityLog.class, Map.class);
        Map uniqueResult = results.getUniqueMappedResult();

        double co2AvoidedKg = uniqueResult != null && uniqueResult.get("totalCo2AvoidedKg") != null ? ((Number) uniqueResult.get("totalCo2AvoidedKg")).doubleValue() : 0.0;

        Aggregation treeAgg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("category").is("trees")),
                Aggregation.group().sum("amount").as("treesPlanted")
        );
        AggregationResults<Map> treeResults = mongoTemplate.aggregate(treeAgg, ActivityLog.class, Map.class);
        Map treeResult = treeResults.getUniqueMappedResult();
        int treesPlanted = treeResult != null && treeResult.get("treesPlanted") != null ? ((Number) treeResult.get("treesPlanted")).intValue() : 0;

        Aggregation waterAgg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("category").is("water")),
                Aggregation.group().sum("amount").as("waterRecycledGal")
        );
        AggregationResults<Map> waterResults = mongoTemplate.aggregate(waterAgg, ActivityLog.class, Map.class);
        Map waterResult = waterResults.getUniqueMappedResult();
        double waterRecycledGal = waterResult != null && waterResult.get("waterRecycledGal") != null ? ((Number) waterResult.get("waterRecycledGal")).doubleValue() : 0.0;

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("co2AvoidedKg", Math.round(co2AvoidedKg * 100.0) / 100.0);
        metrics.put("treesPlanted", treesPlanted);
        metrics.put("waterRecycledGal", Math.round(waterRecycledGal * 100.0) / 100.0);
        metrics.put("status", "ACTIVE_AGGREGATED_LIVE");
        return metrics;
    }
}

