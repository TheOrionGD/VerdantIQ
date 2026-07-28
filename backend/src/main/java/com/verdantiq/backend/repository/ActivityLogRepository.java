package com.verdantiq.backend.repository;

import com.verdantiq.backend.model.ActivityLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {
    List<ActivityLog> findByUserId(String userId);
    List<ActivityLog> findByInstitutionId(String institutionId);
    List<ActivityLog> findByCategory(String category);

    @Query("{ 'category': 'trees' }")
    List<ActivityLog> findAllTreePlantingLogs();
}
