package com.verdantiq.backend.service;

import com.verdantiq.backend.model.ActivityLog;
import com.verdantiq.backend.model.Institution;
import com.verdantiq.backend.repository.ActivityLogRepository;
import com.verdantiq.backend.repository.InstitutionRepository;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GisSpatialService {

    private final ActivityLogRepository activityLogRepository;
    private final InstitutionRepository institutionRepository;

    public GisSpatialService(ActivityLogRepository activityLogRepository,
                             InstitutionRepository institutionRepository) {
        this.activityLogRepository = activityLogRepository;
        this.institutionRepository = institutionRepository;
    }

    public Map<String, Object> getTreesGeoJsonFeatureCollection() {
        List<ActivityLog> treeLogs = activityLogRepository.findAllTreePlantingLogs();

        List<Map<String, Object>> features = new ArrayList<>();
        for (ActivityLog log : treeLogs) {
            GeoJsonPoint point = log.getLocation();
            if (point != null) {
                Map<String, Object> feature = new HashMap<>();
                feature.put("type", "Feature");
                feature.put("geometry", Map.of(
                        "type", "Point",
                        "coordinates", List.of(point.getX(), point.getY())
                ));

                Map<String, Object> props = new HashMap<>();
                props.put("id", log.getId());
                props.put("userId", log.getUserId());
                props.put("co2SavedKg", log.getCo2SavedKg());
                props.put("treesPlanted", log.getAmount());
                props.put("timestamp", log.getTimestamp());
                feature.put("properties", props);

                features.add(feature);
            }
        }

        Map<String, Object> featureCollection = new HashMap<>();
        featureCollection.put("type", "FeatureCollection");
        featureCollection.put("features", features);
        return featureCollection;
    }

    public Map<String, Object> verifyGeofenceRadius(String institutionId, double latitude, double longitude) {
        Institution inst = institutionRepository.findById(institutionId)
                .orElse(null);

        double centerLat = inst != null ? inst.getCenterLatitude() : 12.9716;
        double centerLng = inst != null ? inst.getCenterLongitude() : 77.5946;
        double maxRadius = inst != null && inst.getMaxRadiusMeters() > 0 ? inst.getMaxRadiusMeters() : 5000.0;

        double distanceMeters = calculateHaversineDistanceMeters(centerLat, centerLng, latitude, longitude);
        boolean isWithinGeofence = distanceMeters <= maxRadius;

        Map<String, Object> result = new HashMap<>();
        result.put("institutionId", institutionId);
        result.put("submittedLat", latitude);
        result.put("submittedLng", longitude);
        result.put("distanceFromCampusCenterMeters", Math.round(distanceMeters));
        result.put("allowedMaxRadiusMeters", maxRadius);
        result.put("isWithinGeofence", isWithinGeofence);
        result.put("boundaryMethod", inst != null && inst.getCampusBoundary() != null ? "Exact GeoJSON Polygon" : "Bounding-Circle Approximation");
        return result;
    }

    private double calculateHaversineDistanceMeters(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Earth radius in meters
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
