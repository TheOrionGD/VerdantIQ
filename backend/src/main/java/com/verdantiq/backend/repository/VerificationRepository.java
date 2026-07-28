package com.verdantiq.backend.repository;

import com.verdantiq.backend.model.Verification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface VerificationRepository extends MongoRepository<Verification, String> {
    List<Verification> findByStatus(String status);
    List<Verification> findByInstitutionId(String institutionId);
    List<Verification> findByUserId(String userId);
}
