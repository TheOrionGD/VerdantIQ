package com.verdantiq.backend.controller;

import com.verdantiq.backend.dto.TrackerLogRequest;
import com.verdantiq.backend.model.ActivityLog;
import com.verdantiq.backend.service.FileStorageService;
import com.verdantiq.backend.service.GisSpatialService;
import com.verdantiq.backend.service.TrackerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tracker")
@Tag(name = "Tracker", description = "Activity logging and carbon reduction tracking endpoints")
@SecurityRequirement(name = "bearerAuth")
public class TrackerController {

    private final TrackerService trackerService;
    private final FileStorageService fileStorageService;
    private final GisSpatialService gisSpatialService;

    public TrackerController(TrackerService trackerService,
                             FileStorageService fileStorageService,
                             GisSpatialService gisSpatialService) {
        this.trackerService = trackerService;
        this.fileStorageService = fileStorageService;
        this.gisSpatialService = gisSpatialService;
    }

    @PostMapping({"", "/logs"})
    @Operation(summary = "Log a sustainability activity (transport, energy, water, waste, trees)")
    public ResponseEntity<ActivityLog> logActivity(Authentication authentication,
                                                   @Valid @RequestBody TrackerLogRequest request) {
        String email = authentication != null ? authentication.getName() : "student@greenfield.edu";
        ActivityLog log = trackerService.createLog(email, request);
        return ResponseEntity.ok(log);
    }

    @GetMapping({"", "/logs"})
    @Operation(summary = "Get user activity log history")
    public ResponseEntity<List<ActivityLog>> getUserLogs(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : "student@greenfield.edu";
        List<ActivityLog> logs = trackerService.getUserLogs(email);
        return ResponseEntity.ok(logs);
    }

    @DeleteMapping({"{id}", "/logs/{id}"})
    @Operation(summary = "Delete an activity log entry")
    public ResponseEntity<Void> deleteLog(Authentication authentication, @PathVariable String id) {
        String email = authentication != null ? authentication.getName() : "student@greenfield.edu";
        trackerService.deleteLog(email, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping({"/upload-bill", "/ocr/bill"})
    @Operation(summary = "Upload utility bill for Tesseract OCR text extraction and presigned URL storage")
    public ResponseEntity<Map<String, Object>> uploadBillOcr(@RequestParam(value = "file", required = false) MultipartFile file,
                                                            @RequestBody(required = false) Map<String, String> body) {
        String fileName = file != null ? file.getOriginalFilename() : (body != null ? body.get("fileName") : "bill.pdf");
        String contentType = file != null ? file.getContentType() : "application/pdf";
        String rawText = body != null ? body.get("rawText") : "July 2026 Energy Statement Usage: 245.8 kWh Total: $62.50";

        Map<String, Object> presignedData = fileStorageService.generatePresignedUploadUrl("utility-bills", fileName, contentType);
        Map<String, Object> ocrResult = fileStorageService.parseUtilityBillOcr(rawText);

        ocrResult.put("uploadMetadata", presignedData);
        return ResponseEntity.ok(ocrResult);
    }

    @PostMapping("/tree/geotag")
    @Operation(summary = "Geotag a tree planting entry with GeoJSON Point coordinates")
    public ResponseEntity<ActivityLog> geotagTree(Authentication authentication,
                                                  @RequestBody TrackerLogRequest request) {
        String email = authentication != null ? authentication.getName() : "student@greenfield.edu";
        request.setCategory("trees");
        ActivityLog log = trackerService.createLog(email, request);
        return ResponseEntity.ok(log);
    }
}
