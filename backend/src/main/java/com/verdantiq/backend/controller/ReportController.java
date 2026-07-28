package com.verdantiq.backend.controller;

import com.verdantiq.backend.service.PdfGeneratorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports")
@Tag(name = "Reports", description = "Monthly PDF Statement exports and audit reporting")
@SecurityRequirement(name = "bearerAuth")
public class ReportController {

    private final PdfGeneratorService pdfGeneratorService;

    public ReportController(PdfGeneratorService pdfGeneratorService) {
        this.pdfGeneratorService = pdfGeneratorService;
    }

    @PostMapping("/generate-pdf")
    @Operation(summary = "Request monthly PDF statement generation metadata")
    public ResponseEntity<Map<String, Object>> requestPdfGeneration(Authentication authentication,
                                                                    @RequestBody(required = false) Map<String, String> body) {
        String period = body != null ? body.getOrDefault("period", "July 2026") : "July 2026";
        Map<String, Object> res = new HashMap<>();
        res.put("status", "GENERATED_PDFBOX");
        res.put("period", period);
        res.put("downloadUrl", "/api/v1/reports/monthly-statement?period=" + period.replaceAll("\\s+", "-"));
        res.put("fileSizeMb", 2.4);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/monthly-statement")
    @Operation(summary = "Generate and download a monthly sustainability PDF statement")
    public ResponseEntity<byte[]> downloadMonthlyStatement(Authentication authentication,
                                                           @RequestParam(defaultValue = "July 2026") String period) throws IOException {
        String email = authentication != null ? authentication.getName() : "student@greenfield.edu";
        byte[] pdfContent = pdfGeneratorService.generateMonthlyStatementPdf(email, period);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ecosphere-statement-" + period.replaceAll("\\s+", "-") + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);
    }
}
