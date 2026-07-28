package com.verdantiq.backend.controller;

import com.verdantiq.backend.service.GisSpatialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "GIS & Mapping", description = "Geospatial mapping FeatureCollections and campus geofence validation")
@SecurityRequirement(name = "bearerAuth")
public class GisController {

    private final GisSpatialService gisSpatialService;

    public GisController(GisSpatialService gisSpatialService) {
        this.gisSpatialService = gisSpatialService;
    }

    @GetMapping("/tracker/trees")
    @Operation(summary = "Get all tree planting points formatted as GeoJSON FeatureCollection for Mapbox/Leaflet")
    public ResponseEntity<Map<String, Object>> getTreePlantingFeatureCollection() {
        Map<String, Object> featureCollection = gisSpatialService.getTreesGeoJsonFeatureCollection();
        return ResponseEntity.ok(featureCollection);
    }

    @PostMapping("/gis/verify-geofence")
    @Operation(summary = "Verify if a submitted geotag location falls within campus radius/polygon boundary")
    public ResponseEntity<Map<String, Object>> verifyGeofence(@RequestBody Map<String, Object> payload) {
        String institutionId = (String) payload.get("institutionId");
        double lat = ((Number) payload.get("latitude")).doubleValue();
        double lng = ((Number) payload.get("longitude")).doubleValue();

        Map<String, Object> result = gisSpatialService.verifyGeofenceRadius(institutionId, lat, lng);
        return ResponseEntity.ok(result);
    }
}
