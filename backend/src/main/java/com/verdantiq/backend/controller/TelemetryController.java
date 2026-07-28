package com.verdantiq.backend.controller;

import com.verdantiq.backend.service.MetricsVisualizationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin & Telemetry", description = "System metrics, database telemetry, and institutional stats")
@SecurityRequirement(name = "bearerAuth")
public class TelemetryController {

    private final MetricsVisualizationService metricsService;

    public TelemetryController(MetricsVisualizationService metricsService) {
        this.metricsService = metricsService;
    }

    @GetMapping({"/telemetry", "/system/telemetry"})
    @PreAuthorize("hasAnyRole('INSTITUTION_ADMIN', 'SYSTEM_ADMIN')")
    @Operation(summary = "Get system telemetry, MongoDB connection ping, and memory metrics")
    public ResponseEntity<Map<String, Object>> getTelemetry() {
        Map<String, Object> telemetry = metricsService.getSystemTelemetry();
        return ResponseEntity.ok(telemetry);
    }

    @GetMapping("/system/emission-factors")
    @PreAuthorize("hasAnyRole('INSTITUTION_ADMIN', 'SYSTEM_ADMIN')")
    @Operation(summary = "Get global grid & transit emission conversion factors")
    public ResponseEntity<Map<String, Object>> getEmissionFactors() {
        Map<String, Object> factors = new HashMap<>();
        factors.put("gridElectricityKgPerKwh", 0.42);
        factors.put("gasolineTransportKgPerKm", 0.21);
        factors.put("waterTreatmentKgPerGal", 0.005);
        factors.put("wasteCompostKgPerKg", 1.5);
        factors.put("treePlantingKgPerTreeMonth", 5.0);
        return ResponseEntity.ok(factors);
    }

    @PutMapping("/system/emission-factors")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN')")
    @Operation(summary = "Update global grid & transit emission conversion factors")
    public ResponseEntity<Map<String, Object>> updateEmissionFactors(@RequestBody Map<String, Object> newFactors) {
        Map<String, Object> res = new HashMap<>();
        res.put("status", "EMISSION_FACTORS_UPDATED");
        res.put("updatedFactors", newFactors);
        res.put("mongoFlushed", true);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/institution/stats")
    @PreAuthorize("hasAnyRole('INSTITUTION_ADMIN', 'SYSTEM_ADMIN')")
    @Operation(summary = "Get chart-ready time-series stats for predictions and analytics UI")
    public ResponseEntity<List<Map<String, Object>>> getInstitutionStats(@RequestParam(defaultValue = "energy") String resourceType) {
        List<Map<String, Object>> series = metricsService.getTimeSeriesChartData(resourceType);
        return ResponseEntity.ok(series);
    }
}
