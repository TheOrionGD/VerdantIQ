package com.verdantiq.backend.config;

import com.verdantiq.backend.model.*;
import com.verdantiq.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
public class DatabaseSeedRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final InstitutionRepository institutionRepository;
    private final ActivityLogRepository activityLogRepository;
    private final ChallengeRepository challengeRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeedRunner(UserRepository userRepository,
                              InstitutionRepository institutionRepository,
                              ActivityLogRepository activityLogRepository,
                              ChallengeRepository challengeRepository,
                              PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.institutionRepository = institutionRepository;
        this.activityLogRepository = activityLogRepository;
        this.challengeRepository = challengeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        try {
            if (institutionRepository.count() == 0) {
                Institution institution = Institution.builder()
                        .id("inst-seed-101")
                        .name("Greenfield Eco University")
                        .type("University")
                        .centerLatitude(12.9716)
                        .centerLongitude(77.5946)
                        .maxRadiusMeters(5000.0)
                        .createdAt(Instant.now())
                        .build();
                
                Institution savedInst = institutionRepository.save(institution);
                String instId = savedInst != null && savedInst.getId() != null ? savedInst.getId() : "inst-seed-101";

                if (userRepository.count() == 0) {
                    User sysAdmin = User.builder()
                            .id("usr-admin-1")
                            .email("admin@verdantiq.io")
                            .passwordHash(passwordEncoder.encode("AdminPass123!"))
                            .fullName("System Administrator")
                            .role(Role.SYSTEM_ADMIN)
                            .createdAt(Instant.now())
                            .build();

                    User instAdmin = User.builder()
                            .id("usr-inst-admin-1")
                            .email("campus.admin@greenfield.edu")
                            .passwordHash(passwordEncoder.encode("CampusPass123!"))
                            .fullName("Eco Campus Officer")
                            .role(Role.INSTITUTION_ADMIN)
                            .institutionId(instId)
                            .createdAt(Instant.now())
                            .build();

                    User stdUser = User.builder()
                            .id("usr-std-user-1")
                            .email("student@greenfield.edu")
                            .passwordHash(passwordEncoder.encode("StudentPass123!"))
                            .fullName("Alex Rivera")
                            .role(Role.STANDARD_USER)
                            .institutionId(instId)
                            .createdAt(Instant.now())
                            .build();

                    userRepository.saveAll(List.of(sysAdmin, instAdmin, stdUser));

                    if (activityLogRepository.count() == 0) {
                        ActivityLog treeLog = ActivityLog.builder()
                                .id("act-tree-1")
                                .userId(stdUser.getId())
                                .institutionId(instId)
                                .category("trees")
                                .co2SavedKg(25.0)
                                .amount(5.0)
                                .unit("trees")
                                .location(new GeoJsonPoint(77.5946, 12.9716))
                                .timestamp(Instant.now().minusSeconds(86400 * 2))
                                .build();

                        ActivityLog transitLog = ActivityLog.builder()
                                .id("act-transit-1")
                                .userId(stdUser.getId())
                                .institutionId(instId)
                                .category("transport")
                                .co2SavedKg(4.2)
                                .amount(15.0)
                                .unit("km")
                                .location(new GeoJsonPoint(77.5920, 12.9730))
                                .timestamp(Instant.now().minusSeconds(86400))
                                .build();

                        ActivityLog energyLog = ActivityLog.builder()
                                .id("act-energy-1")
                                .userId(stdUser.getId())
                                .institutionId(instId)
                                .category("energy")
                                .co2SavedKg(12.8)
                                .amount(18.5)
                                .unit("kWh")
                                .location(new GeoJsonPoint(77.5955, 12.9705))
                                .timestamp(Instant.now())
                                .build();

                        activityLogRepository.saveAll(List.of(treeLog, transitLog, energyLog));
                    }

                    if (challengeRepository.count() == 0) {
                        Challenge challenge1 = Challenge.builder()
                                .id("chal-1")
                                .title("Campus Tree Planting Drive")
                                .description("Plant at least 2 saplings within campus grounds and upload verification photos.")
                                .co2RewardKg(10.0)
                                .category("trees")
                                .institutionId(instId)
                                .active(true)
                                .build();

                        Challenge challenge2 = Challenge.builder()
                                .id("chal-2")
                                .title("Zero Waste Cafeteria Week")
                                .description("Compost organic meal waste for 5 consecutive days.")
                                .co2RewardKg(8.5)
                                .category("waste")
                                .institutionId(instId)
                                .active(true)
                                .build();

                        challengeRepository.saveAll(List.of(challenge1, challenge2));
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Database seeding skipped or failed safely: " + e.getMessage());
        }
    }
}
