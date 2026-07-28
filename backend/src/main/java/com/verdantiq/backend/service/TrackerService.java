package com.verdantiq.backend.service;

import com.verdantiq.backend.dto.TrackerLogRequest;
import com.verdantiq.backend.model.ActivityLog;
import com.verdantiq.backend.model.User;
import com.verdantiq.backend.repository.ActivityLogRepository;
import com.verdantiq.backend.repository.UserRepository;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class TrackerService {

    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;

    public TrackerService(ActivityLogRepository activityLogRepository, UserRepository userRepository) {
        this.activityLogRepository = activityLogRepository;
        this.userRepository = userRepository;
    }

    public ActivityLog createLog(String email, TrackerLogRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        double co2Saved = calculateCo2Savings(request.getCategory(), request.getAmount());

        GeoJsonPoint location = null;
        if (request.getLongitude() != null && request.getLatitude() != null) {
            location = new GeoJsonPoint(request.getLongitude(), request.getLatitude());
        }

        ActivityLog log = ActivityLog.builder()
                .userId(user.getId())
                .institutionId(user.getInstitutionId())
                .category(request.getCategory().toLowerCase())
                .amount(request.getAmount())
                .unit(request.getUnit() != null ? request.getUnit() : defaultUnitFor(request.getCategory()))
                .co2SavedKg(Math.round(co2Saved * 100.0) / 100.0)
                .location(location)
                .timestamp(Instant.now())
                .build();

        return activityLogRepository.save(log);
    }

    public List<ActivityLog> getUserLogs(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
        return activityLogRepository.findByUserId(user.getId());
    }

    public void deleteLog(String email, String logId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        ActivityLog log = activityLogRepository.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("Activity log not found: " + logId));

        if (!log.getUserId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to delete log belonging to another user.");
        }

        activityLogRepository.deleteById(logId);
    }

    private double calculateCo2Savings(String category, double amount) {
        return switch (category.toLowerCase()) {
            case "transport" -> amount * 0.21; // kg CO2 saved per km switched from gas car
            case "energy" -> amount * 0.42;    // kg CO2 saved per kWh reduced
            case "water" -> amount * 0.005;   // kg CO2 saved per gallon conserved
            case "waste" -> amount * 1.5;     // kg CO2 saved per kg composted
            case "trees" -> amount * 5.0;     // kg CO2 sequestered per tree planted
            default -> amount * 0.1;
        };
    }

    private String defaultUnitFor(String category) {
        return switch (category.toLowerCase()) {
            case "transport" -> "km";
            case "energy" -> "kWh";
            case "water" -> "gallons";
            case "waste" -> "kg";
            case "trees" -> "trees";
            default -> "units";
        };
    }
}
