package com.verdantiq.backend.repository;

import com.verdantiq.backend.model.Institution;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface InstitutionRepository extends MongoRepository<Institution, String> {
    Optional<Institution> findByName(String name);
}
