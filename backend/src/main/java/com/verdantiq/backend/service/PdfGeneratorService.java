package com.verdantiq.backend.service;

import com.verdantiq.backend.model.ActivityLog;
import com.verdantiq.backend.model.User;
import com.verdantiq.backend.repository.ActivityLogRepository;
import com.verdantiq.backend.repository.UserRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfGeneratorService {

    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;

    public PdfGeneratorService(ActivityLogRepository activityLogRepository, UserRepository userRepository) {
        this.activityLogRepository = activityLogRepository;
        this.userRepository = userRepository;
    }

    public byte[] generateMonthlyStatementPdf(String userEmail, String statementPeriod) throws IOException {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        List<ActivityLog> logs = activityLogRepository.findByUserId(user.getId());

        double totalCo2Saved = logs.stream().mapToDouble(ActivityLog::getCo2SavedKg).sum();

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                content.beginText();
                content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 18);
                content.setLeading(22f);
                content.newLineAtOffset(50, 750);

                content.showText("EcoSphere (VerdantIQ) - Monthly Sustainability Statement");
                content.newLine();
                content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                content.showText("Statement Period: " + statementPeriod);
                content.newLine();
                content.showText("User Account: " + user.getFullName() + " (" + user.getEmail() + ")");
                content.newLine();
                content.showText("Total Verified Carbon Offset: " + String.format("%.2f", totalCo2Saved) + " kg CO2e");
                content.newLine();
                content.newLine();

                content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 13);
                content.showText("Activity Log Summary Breakdown:");
                content.newLine();
                content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 11);

                int logCount = 0;
                for (ActivityLog log : logs) {
                    if (logCount++ >= 15) break; // Limit to 15 logs per page for space
                    String logLine = String.format("- Category: %-10s | Amount: %.1f %-6s | CO2 Saved: %.2f kg",
                            log.getCategory().toUpperCase(), log.getAmount(), log.getUnit(), log.getCo2SavedKg());
                    content.showText(logLine);
                    content.newLine();
                }

                content.newLine();
                content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_OBLIQUE), 10);
                content.showText("Certified by EcoSphere Algorithmic Verification Engine");
                content.endText();
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return out.toByteArray();
        }
    }
}
