package com.example.demo.notification;

import com.example.demo.user.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @Column(name = "id_notification", nullable = false, unique = true)
    private UUID idNotification;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String title;
    private String message;

    @Column(name = "is_read")
    private boolean isRead;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Getters, setters, constructeurs omis
}
