package com.example.demo.notification;

import com.example.demo.user.User;
import com.example.demo.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestHeader("Authorization") String authHeader,
                                                           @RequestParam String title,
                                                           @RequestParam String message) {
        User user = userService.getUserByJwt(authHeader);
        return ResponseEntity.ok(notificationService.createNotification(user, title, message));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@RequestHeader("Authorization") String authHeader,@PathVariable User user) {
        return ResponseEntity.ok(notificationService.getNotificationsByUser(user));
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Notification> markAsRead(@RequestHeader("Authorization") String authHeader,@PathVariable UUID notificationId) {
        return ResponseEntity.ok(notificationService.markAsRead(notificationId));
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<?> deleteNotification(@RequestHeader("Authorization") String authHeader,@PathVariable UUID notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Long> getUnreadCount(@RequestHeader("Authorization") String authHeader,@PathVariable UUID userId) {
        return ResponseEntity.ok(notificationService.getUnreadCount(userId));
    }
}

