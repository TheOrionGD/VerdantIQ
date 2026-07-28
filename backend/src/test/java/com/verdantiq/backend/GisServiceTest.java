package com.verdantiq.backend;

import com.verdantiq.backend.model.ActivityLog;
import com.verdantiq.backend.model.Institution;
import com.verdantiq.backend.repository.ActivityLogRepository;
import com.verdantiq.backend.repository.InstitutionRepository;
import com.verdantiq.backend.service.GisSpatialService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class GisServiceTest {

    private ActivityLogRepository activityLogRepository;
    private InstitutionRepository institutionRepository;
    private GisSpatialService gisSpatialService;

    @BeforeEach
    void setUp() {
        activityLogRepository = Mockito.mock(ActivityLogRepository.class);
        institutionRepository = Mockito.mock(InstitutionRepository.class);
        gisSpatialService = new GisSpatialService(activityLogRepository, institutionRepository);
    }

    @Test
    void testGetTreesGeoJsonFeatureCollection() {
        ActivityLog treeLog = new ActivityLog();
        treeLog.setId("tree-1");
        treeLog.setUserId("user-1");
        treeLog.setCategory("trees");
        treeLog.setAmount(5);
        treeLog.setCo2SavedKg(60.0);
        treeLog.setLocation(new GeoJsonPoint(77.5946, 12.9716));

        when(activityLogRepository.findAllTreePlantingLogs()).thenReturn(List.of(treeLog));

        Map<String, Object> featureCollection = gisSpatialService.getTreesGeoJsonFeatureCollection();
        assertNotNull(featureCollection);
        assertEquals("FeatureCollection", featureCollection.get("type"));
        List<?> features = (List<?>) featureCollection.get("features");
        assertFalse(features.isEmpty());
    }

    @Test
    void testVerifyGeofenceRadius_WithinRadius() {
        Institution inst = new Institution();
        inst.setId("inst-1");
        inst.setCenterLatitude(12.9716);
        inst.setCenterLongitude(77.5946);
        inst.setMaxRadiusMeters(5000.0);

        when(institutionRepository.findById("inst-1")).thenReturn(Optional.of(inst));

        Map<String, Object> result = gisSpatialService.verifyGeofenceRadius("inst-1", 12.9720, 77.5950);
        assertNotNull(result);
        assertTrue((Boolean) result.get("isWithinGeofence"));
        assertEquals("inst-1", result.get("institutionId"));
    }

    @Test
    void testVerifyGeofenceRadius_OutsideRadius() {
        Institution inst = new Institution();
        inst.setId("inst-1");
        inst.setCenterLatitude(12.9716);
        inst.setCenterLongitude(77.5946);
        inst.setMaxRadiusMeters(500.0); // Strict 500m radius

        when(institutionRepository.findById("inst-1")).thenReturn(Optional.of(inst));

        // Point far away (approx 100km away)
        Map<String, Object> result = gisSpatialService.verifyGeofenceRadius("inst-1", 13.9716, 78.5946);
        assertNotNull(result);
        assertFalse((Boolean) result.get("isWithinGeofence"));
    }
}
