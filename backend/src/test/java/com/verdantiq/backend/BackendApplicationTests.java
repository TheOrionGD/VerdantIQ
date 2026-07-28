package com.verdantiq.backend;

import com.verdantiq.backend.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;

@SpringBootTest
class BackendApplicationTests {

    @MockBean
    private MongoDatabaseFactory mongoDatabaseFactory;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private HouseholdTwinRepository householdTwinRepository;

    @MockBean
    private ActivityLogRepository activityLogRepository;

    @MockBean
    private ChallengeRepository challengeRepository;

    @MockBean
    private VerificationRepository verificationRepository;

    @MockBean
    private InstitutionRepository institutionRepository;

    @MockBean
    private NotificationRepository notificationRepository;

    @MockBean
    private MongoTemplate mongoTemplate;

    @MockBean
    private MongoConverter mongoConverter;

    @MockBean
    private MappingMongoConverter mappingMongoConverter;

    @MockBean
    private GridFsTemplate gridFsTemplate;

    @Test
    void contextLoads() {
    }
}
