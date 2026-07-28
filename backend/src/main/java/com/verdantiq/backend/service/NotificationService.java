package com.verdantiq.backend.service;

import com.verdantiq.backend.model.Notification;
import com.verdantiq.backend.model.User;
import com.verdantiq.backend.repository.NotificationRepository;
import com.verdantiq.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final Map<String, List<SseEmitter>> userEmitters = new ConcurrentHashMap<>();

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public List<Notification> getUserNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public Notification markAsRead(String email, String notificationId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found: " + notificationId));

        if (!notification.getUserId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to modify notification for another user.");
        }

        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public List<Notification> markAllAsRead(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        List<Notification> userNotifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        userNotifications.forEach(n -> n.setRead(true));
        return notificationRepository.saveAll(userNotifications);
    }

    public SseEmitter subscribeUserStream(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        SseEmitter emitter = new SseEmitter(1800000L); // 30 min timeout
        String userId = user.getId();

        userEmitters.computeIfAbsent(userId, k -> new ArrayList<>()).add(emitter);

        emitter.onCompletion(() -> removeEmitter(userId, emitter));
        emitter.onTimeout(() -> removeEmitter(userId, emitter));
        emitter.onError((e) -> removeEmitter(userId, emitter));

        try {
            emitter.send(SseEmitter.event()
                    .name("INIT")
                    .data("Connected to EcoSphere notification stream for user: " + userId));
        } catch (IOException e) {
            removeEmitter(userId, emitter);
        }

        return emitter;
    }

    public Notification createNotification(String userId, String type, String title, String message) {
        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .message(message)
                .read(false)
                .createdAt(Instant.now())
                .build();

        Notification saved = notificationRepository.save(notification);
        broadcastNotificationToUser(userId, saved);
        return saved;
    }

    private void broadcastNotificationToUser(String userId, Notification notification) {
        List<SseEmitter> emitters = userEmitters.get(userId);
        if (emitters != null && !emitters.isEmpty()) {
            List<SseEmitter> deadEmitters = new ArrayList<>();
            for (SseEmitter emitter : emitters) {
                try {
                    emitter.send(SseEmitter.event()
                            .name("NOTIFICATION")
                            .data(notification));
                } catch (Exception e) {
                    deadEmitters.add(emitter);
                }
            }
            emitters.removeAll(deadEmitters);
        }
    }

    private void removeEmitter(String userId, SseEmitter emitter) {
        List<SseEmitter> list = userEmitters.get(userId);
        if (list != null) {
            list.remove(emitter);
        }
    }
}

