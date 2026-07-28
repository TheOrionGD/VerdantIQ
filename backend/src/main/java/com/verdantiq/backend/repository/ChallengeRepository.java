package com.verdantiq.backend.repository;

import com.verdantiq.backend.model.Challenge;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChallengeRepository extends MongoRepository<Challenge, String> {
    List<Challenge> findByInstitutionIdAndActiveTrue(String institutionId);
    List<Challenge> findByActiveTrue();
}
