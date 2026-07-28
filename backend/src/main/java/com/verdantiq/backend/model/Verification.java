package com.verdantiq.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "verifications")
public class Verification {

    @Id
    private String id;

    private String userId;
    private String challengeId;
    private String institutionId;
    private String photoUrl;
    private GeoJsonPoint geotagLocation;
    private String status; // PENDING, APPROVED, REJECTED
    private Instant timestamp;
    private String reviewedBy;
}
