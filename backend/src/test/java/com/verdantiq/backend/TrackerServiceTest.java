package com.verdantiq.backend;

import com.verdantiq.backend.dto.TrackerLogRequest;
import com.verdantiq.backend.model.ActivityLog;
import com.verdantiq.backend.model.User;
import com.verdantiq.backend.repository.ActivityLogRepository;
import com.verdantiq.backend.repository.UserRepository;
import com.verdantiq.backend.service.TrackerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TrackerServiceTest {

    @Mock
    private ActivityLogRepository activityLogRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TrackerService trackerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should successfully create activity log entry with GeoJSON point")
    void createLog_TreesCategory_Success() {
        String email = "student@greenfield.edu";
        User user = User.builder().id("usr-1").institutionId("inst-1").email(email).build();

        TrackerLogRequest req = new TrackerLogRequest();
        req.setCategory("trees");
        req.setAmount(3.0);
        req.setLongitude(77.5946);
        req.setLatitude(12.9716);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(activityLogRepository.save(any(ActivityLog.class))).thenAnswer(inv -> inv.getArgument(0));

        ActivityLog log = trackerService.createLog(email, req);

        assertNotNull(log);
        assertEquals("usr-1", log.getUserId());
        assertEquals("inst-1", log.getInstitutionId());
        assertEquals("trees", log.getCategory());
        assertEquals(15.0, log.getCo2SavedKg()); // 3 * 5.0 = 15.0
        assertNotNull(log.getLocation());
        assertEquals(77.5946, log.getLocation().getX());
        assertEquals(12.9716, log.getLocation().getY());
    }

    @Test
    @DisplayName("Should return user activity logs")
    void getUserLogs_Success() {
        String email = "student@greenfield.edu";
        User user = User.builder().id("usr-1").email(email).build();
        ActivityLog mockLog = ActivityLog.builder().id("log-1").userId("usr-1").build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(activityLogRepository.findByUserId("usr-1")).thenReturn(List.of(mockLog));

        List<ActivityLog> logs = trackerService.getUserLogs(email);

        assertEquals(1, logs.size());
        assertEquals("log-1", logs.get(0).getId());
    }

    @Test
    @DisplayName("Should delete log entry owned by authenticated user")
    void deleteLog_Owner_Success() {
        String email = "student@greenfield.edu";
        User user = User.builder().id("usr-1").email(email).build();
        ActivityLog mockLog = ActivityLog.builder().id("log-1").userId("usr-1").build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(activityLogRepository.findById("log-1")).thenReturn(Optional.of(mockLog));

        trackerService.deleteLog(email, "log-1");

        verify(activityLogRepository, times(1)).deleteById("log-1");
    }

    @Test
    @DisplayName("Should throw SecurityException when deleting log owned by another user")
    void deleteLog_NotOwner_ThrowsSecurityException() {
        String email = "student@greenfield.edu";
        User user = User.builder().id("usr-1").email(email).build();
        ActivityLog mockLog = ActivityLog.builder().id("log-1").userId("other-user").build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(activityLogRepository.findById("log-1")).thenReturn(Optional.of(mockLog));

        assertThrows(SecurityException.class, () -> trackerService.deleteLog(email, "log-1"));
    }
}
