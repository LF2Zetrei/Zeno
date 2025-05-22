package com.example.demo.badge;

import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import com.example.demo.user_badge.UserBadge;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BadgeService {

    private final UserRepository userRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final BadgeRepository badgeRepository;

    public BadgeService(UserRepository userRepository, UserBadgeRepository userBadgeRepository, BadgeRepository badgeRepository) {
        this.userRepository = userRepository;
        this.userBadgeRepository = userBadgeRepository;
        this.badgeRepository = badgeRepository;
    }

    public Badge createBadge(String name, String description) {
        Badge badge = new Badge();
        badge.setIdBadge(UUID.randomUUID());
        badge.setNom(name);
        badge.setDescription(description);
        return badgeRepository.save(badge);
    }

    public void assignBadgeToUser(UUID badgeId, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Badge badge = badgeRepository.findById(badgeId)
                .orElseThrow(() -> new RuntimeException("Badge not found"));

        // Évite les doublons si déjà attribué
        if (userBadgeRepository.existsByUserAndBadge(user, badge)) return;

        UserBadge userBadge = new UserBadge();
        userBadge.setUser(user);
        userBadge.setBadge(badge);
        userBadge.setEarnedAt(LocalDateTime.now());
        userBadgeRepository.save(userBadge);
    }

    public List<Badge> getUserBadges(User user) {
        return userBadgeRepository.findByUser(user).stream()
                .map(UserBadge::getBadge)
                .collect(Collectors.toList());
    }
}
