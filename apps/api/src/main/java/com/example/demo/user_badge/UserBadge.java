package com.example.demo.user_badge;

import com.example.demo.badge.Badge;
import com.example.demo.user.User;
import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_badge")
@IdClass(UserBadgeId.class)
public class UserBadge {

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "badge_id")
    private Badge badge;

    @Column(name = "earned_at")
    private LocalDateTime earnedAt;

    // Getters, setters, constructeurs omis
}

