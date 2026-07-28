package com.verdantiq.backend;

import com.verdantiq.backend.service.FileStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class FileStorageServiceTest {

    private FileStorageService fileStorageService;

    @BeforeEach
    void setUp() {
        fileStorageService = new FileStorageService();
    }

    @Test
    void testGeneratePresignedUploadUrl_Success() {
        Map<String, Object> result = fileStorageService.generatePresignedUploadUrl("utility-bills", "july_statement.pdf", "application/pdf");
        assertNotNull(result);
        assertEquals("utility-bills", result.get("bucket"));
        assertNotNull(result.get("presignedUploadUrl"));
        assertTrue(result.get("presignedUploadUrl").toString().contains("utility-bills"));
        assertEquals(3600, result.get("expirySeconds"));
    }

    @Test
    void testGeneratePresignedUploadUrl_InvalidBucket_ThrowsException() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            fileStorageService.generatePresignedUploadUrl("invalid-bucket", "test.txt", "text/plain");
        });
        assertTrue(exception.getMessage().contains("Invalid storage bucket"));
    }

    @Test
    void testParseUtilityBillOcr_ExtractKwh() {
        String rawText = "Monthly Eco Statement Total kWh used: 345.5 kWh Amount Due: $45.20";
        Map<String, Object> ocrResult = fileStorageService.parseUtilityBillOcr(rawText);
        assertNotNull(ocrResult);
        assertEquals(345.5, (Double) ocrResult.get("extractedUsageKwh"), 0.01);
        assertEquals("ENERGY_ELECTRICITY", ocrResult.get("detectedCategory"));
        assertEquals("SUCCESS", ocrResult.get("status"));
    }

    @Test
    void testExtractVerificationPhotoGeotag() {
        Map<String, Object> metadata = fileStorageService.extractVerificationPhotoGeotag("tree_plant.jpg", 12.9716, 77.5946);
        assertNotNull(metadata);
        assertEquals(12.9716, (Double) metadata.get("extractedLatitude"), 0.001);
        assertEquals(77.5946, (Double) metadata.get("extractedLongitude"), 0.001);
        assertTrue((Boolean) metadata.get("exifExtracted"));
    }
}
