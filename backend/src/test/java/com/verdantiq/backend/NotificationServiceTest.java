package com.verdantiq.backend;

import com.verdantiq.backend.model.Notification;
import com.verdantiq.backend.model.User;
import com.verdantiq.backend.repository.NotificationRepository;
import com.verdantiq.backend.repository.UserRepository;
import com.verdantiq.backend.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private NotificationService notificationService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        sampleUser = User.builder().id("usr-101").email("student@verdantiq.io").build();
    }

    @Test
    @DisplayName("Should retrieve notifications for valid user email")
    void getUserNotifications_Success() {
        when(userRepository.findByEmail("student@verdantiq.io")).thenReturn(Optional.of(sampleUser));
        Notification n1 = Notification.builder().id("n-1").userId("usr-101").title("Anomaly Alert").read(false).build();
        when(notificationRepository.findByUserIdOrderByCreatedAtDesc("usr-101")).thenReturn(List.of(n1));

        List<Notification> result = notificationService.getUserNotifications("student@verdantiq.io");

        assertEquals(1, result.size());
        assertEquals("Anomaly Alert", result.get(0).getTitle());
    }

    @Test
    @DisplayName("Should mark a specific notification as read")
    void markAsRead_Success() {
        when(userRepository.findByEmail("student@verdantiq.io")).thenReturn(Optional.of(sampleUser));
        Notification n1 = Notification.builder().id("n-1").userId("usr-101").read(false).build();
        when(notificationRepository.findById("n-1")).thenReturn(Optional.of(n1));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(i -> i.getArgument(0));

        Notification updated = notificationService.markAsRead("student@verdantiq.io", "n-1");

        assertTrue(updated.isRead());
    }

    @Test
    @DisplayName("Should mark all notifications as read for current user")
    void markAllAsRead_Success() {
        when(userRepository.findByEmail("student@verdantiq.io")).thenReturn(Optional.of(sampleUser));
        Notification n1 = Notification.builder().id("n-1").userId("usr-101").read(false).build();
        Notification n2 = Notification.builder().id("n-2").userId("usr-101").read(false).build();
        when(notificationRepository.findByUserIdOrderByCreatedAtDesc("usr-101")).thenReturn(List.of(n1, n2));
        when(notificationRepository.saveAll(anyList())).thenAnswer(i -> i.getArgument(0));

        List<Notification> updatedList = notificationService.markAllAsRead("student@verdantiq.io");

        assertEquals(2, updatedList.size());
        assertTrue(updatedList.stream().allMatch(Notification::isRead));
    }

    @Test
    @DisplayName("Should initialize SSE emitter stream for user")
    void subscribeUserStream_Success() {
        when(userRepository.findByEmail("student@verdantiq.io")).thenReturn(Optional.of(sampleUser));

        SseEmitter emitter = notificationService.subscribeUserStream("student@verdantiq.io");

        assertNotNull(emitter);
    }

    @Test
    @DisplayName("Should create and save new notification")
    void createNotification_Success() {
        when(notificationRepository.save(any(Notification.class))).thenAnswer(i -> i.getArgument(0));

        Notification created = notificationService.createNotification("usr-101", "ANOMALY", "Energy Spike", "Usage spiked by 25%.");

        assertNotNull(created);
        assertEquals("usr-101", created.getUserId());
        assertEquals("ANOMALY", created.getType());
        assertEquals("Energy Spike", created.getTitle());
        assertFalse(created.isRead());
    }
}
