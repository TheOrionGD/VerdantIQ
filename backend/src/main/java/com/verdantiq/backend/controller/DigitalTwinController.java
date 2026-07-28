package com.verdantiq.backend.controller;

import com.verdantiq.backend.model.HouseholdTwin;
import com.verdantiq.backend.repository.HouseholdTwinRepository;
import com.verdantiq.backend.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Digital Twin & Optimization", description = "Household Digital Twin simulation and MILP plan application endpoints")
@SecurityRequirement(name = "bearerAuth")
public class DigitalTwinController {

    private final HouseholdTwinRepository householdTwinRepository;
    private final UserRepository userRepository;

    public DigitalTwinController(HouseholdTwinRepository householdTwinRepository, UserRepository userRepository) {
        this.householdTwinRepository = householdTwinRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/twin/state")
    @Operation(summary = "Get current household digital twin simulation state")
    public ResponseEntity<Map<String, Object>> getTwinState(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : "student@greenfield.edu";
        Map<String, Object> state = new HashMap<>();
        state.put("userEmail", email);
        state.put("ecoScore", 74);
        state.put("activeHardwareUpgrades", List.of("LED Smart Lighting", "Low-Flow Aerator"));
        state.put("baselineCo2Kg", 320.0);
        state.put("status", "SIMULATION_READY");
        return ResponseEntity.ok(state);
    }

    @GetMapping("/twin/state/upgrades")
    @Operation(summary = "Get available hardware/appliance upgrade catalog")
    public ResponseEntity<List<Map<String, Object>>> getAvailableUpgrades() {
        List<Map<String, Object>> upgrades = List.of(
                Map.of("id", "solar", "name", "5kW Rooftop Solar Array", "category", "Roof", "cost", 1200, "offset", 140, "water", 0, "payback", 18),
                Map.of("id", "led", "name", "LED Smart Lighting Kit", "category", "Kitchen", "cost", 40, "offset", 12, "water", 0, "payback", 4),
                Map.of("id", "rain", "name", "Rainwater Harvester Tank", "category", "Garden", "cost", 350, "offset", 25, "water", 450, "payback", 12),
                Map.of("id", "charger", "name", "Level 2 EV Smart Charger", "category", "Garage", "cost", 500, "offset", 85, "water", 0, "payback", 14)
        );
        return ResponseEntity.ok(upgrades);
    }

    @PostMapping("/twin/upgrade")
    @Operation(summary = "Toggle or purchase a digital twin hardware upgrade")
    public ResponseEntity<Map<String, Object>> toggleHardwareUpgrade(Authentication authentication, @RequestBody Map<String, String> body) {
        String email = authentication != null ? authentication.getName() : "student@greenfield.edu";
        String upgradeId = body.get("upgradeId");
        Map<String, Object> res = new HashMap<>();
        res.put("userEmail", email);
        res.put("upgradeId", upgradeId);
        res.put("status", "UPGRADE_APPLIED");
        res.put("newBaselineOffsetKg", 295.0);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/optimizer/apply-plan")
    @Operation(summary = "Apply Google OR-Tools optimization roadmap to user target goals")
    public ResponseEntity<Map<String, Object>> applyOptimizedPlan(Authentication authentication, @RequestBody Map<String, Object> body) {
        String email = authentication != null ? authentication.getName() : "student@greenfield.edu";
        Map<String, Object> res = new HashMap<>();
        res.put("userEmail", email);
        res.put("appliedRoadmap", body.get("roadmap"));
        res.put("status", "OPTIMIZATION_PLAN_ACTIVE");
        return ResponseEntity.ok(res);
    }
}
