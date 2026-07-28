package com.verdantiq.backend;

import com.verdantiq.backend.model.ActivityLog;
import com.verdantiq.backend.model.User;
import com.verdantiq.backend.repository.ActivityLogRepository;
import com.verdantiq.backend.repository.UserRepository;
import com.verdantiq.backend.service.PdfGeneratorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class PdfGeneratorServiceTest {

    @Mock
    private ActivityLogRepository activityLogRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PdfGeneratorService pdfGeneratorService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should successfully generate monthly statement PDF bytes using Apache PDFBox")
    void generateMonthlyStatementPdf_Success() throws IOException {
        String email = "student@greenfield.edu";
        User user = User.builder().id("usr-1").email(email).fullName("Alex Rivera").build();

        ActivityLog log1 = ActivityLog.builder().id("act-1").userId("usr-1").category("trees").amount(5).unit("trees").co2SavedKg(25.0).timestamp(Instant.now()).build();
        ActivityLog log2 = ActivityLog.builder().id("act-2").userId("usr-1").category("transport").amount(10).unit("km").co2SavedKg(2.1).timestamp(Instant.now()).build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(activityLogRepository.findByUserId("usr-1")).thenReturn(List.of(log1, log2));

        byte[] pdfBytes = pdfGeneratorService.generateMonthlyStatementPdf(email, "July 2026");

        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);

        // Verify PDF Header Magic Bytes (%PDF-)
        String pdfHeader = new String(pdfBytes, 0, 4);
        assertEquals("%PDF", pdfHeader);
    }
}
