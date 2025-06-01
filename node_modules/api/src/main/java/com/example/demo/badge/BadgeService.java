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

    public void assignBadgeToUser(UUID badgeId, User user) {
        Badge badge = badgeRepository.findByIdBadge(badgeId)
                .orElseThrow(() -> new RuntimeException("Badge not found"));

        if (userBadgeRepository.existsByUserAndBadge(user, badge))  {
            throw new RuntimeException("User already has this badge");
        }

        UserBadge userBadge = new UserBadge();
        userBadge.setUser(user);
        userBadge.setBadge(badge);
        userBadge.setEarnedAt(LocalDateTime.now());
        userBadgeRepository.save(userBadge);
    }

    public void unAssignBadgeToUser(UUID badgeId, User user){

        UserBadge userBadge = userBadgeRepository.findByUser(user).stream()
                .filter(ub -> ub.getBadge().getIdBadge().equals(badgeId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User doesn't have this badge"));

        userBadgeRepository.delete(userBadge);
    }

    public void deleteBadge(UUID badgeId) {
        Badge badge = badgeRepository.findByIdBadge(badgeId)
                .orElseThrow(() -> new RuntimeException("Badge not found"));

        // Supprimer tous les liens UserBadge associés à ce badge
        List<UserBadge> userBadges = userBadgeRepository.findByBadge(badge);
        userBadgeRepository.deleteAll(userBadges);

        // Supprimer le badge lui-même
        badgeRepository.delete(badge);
    }

    public List<Badge> getUserBadges(User user) {
        return userBadgeRepository.findByUser(user).stream()
                .map(UserBadge::getBadge)
                .collect(Collectors.toList());
    }
}
