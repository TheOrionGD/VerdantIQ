package com.verdantiq.backend.controller;

import com.verdantiq.backend.model.Notification;
import com.verdantiq.backend.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Notifications", description = "In-app notifications and real-time SSE streaming alert feed")
@SecurityRequirement(name = "bearerAuth")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    @Operation(summary = "Get user in-app notification feed")
    public ResponseEntity<List<Notification>> getUserNotifications(Authentication authentication) {
        String email = authentication.getName();
        List<Notification> notifications = notificationService.getUserNotifications(email);
        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<Notification> markNotificationRead(Authentication authentication, @PathVariable String id) {
        String email = authentication.getName();
        Notification updated = notificationService.markAsRead(email, id);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Mark all notifications as read for current user")
    public ResponseEntity<List<Notification>> markAllNotificationsRead(Authentication authentication) {
        String email = authentication.getName();
        List<Notification> updated = notificationService.markAllAsRead(email);
        return ResponseEntity.ok(updated);
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "Subscribe to live real-time Server-Sent Events (SSE) notification stream")
    public SseEmitter subscribeStream(Authentication authentication) {
        String email = authentication.getName();
        return notificationService.subscribeUserStream(email);
    }

    @PostMapping
    @Operation(summary = "Create and dispatch a new notification for a specific user (System/Admin/Trigger)")
    public ResponseEntity<Notification> createNotification(@RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        String type = payload.getOrDefault("type", "ANOMALY");
        String title = payload.getOrDefault("title", "Eco Alert");
        String message = payload.getOrDefault("message", "Activity update recorded.");

        Notification created = notificationService.createNotification(userId, type, title, message);
        return ResponseEntity.ok(created);
    }
}

