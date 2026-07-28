package com.verdantiq.backend.repository;

import com.verdantiq.backend.model.HouseholdTwin;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface HouseholdTwinRepository extends MongoRepository<HouseholdTwin, String> {
    Optional<HouseholdTwin> findByUserId(String userId);
}
