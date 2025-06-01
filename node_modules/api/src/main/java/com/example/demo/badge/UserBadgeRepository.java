package com.example.demo.badge;

import com.example.demo.user.User;
import com.example.demo.user_badge.UserBadge;
import com.example.demo.user_badge.UserBadgeId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserBadgeRepository extends JpaRepository<UserBadge, UserBadgeId> {
    List<UserBadge> findByUser(User user);

    boolean existsByUserAndBadge(User user, Badge badge);
    List<UserBadge> findByBadge(Badge badge);
}
