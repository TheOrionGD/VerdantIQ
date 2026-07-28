package com.verdantiq.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPolygon;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "institutions")
public class Institution {

    @Id
    private String id;

    private String name;
    private String type; // University, Corporate, Municipality
    private GeoJsonPolygon campusBoundary;
    private double centerLatitude;
    private double centerLongitude;
    private double maxRadiusMeters;
    private String adminUserId;
    private Instant createdAt;
}
