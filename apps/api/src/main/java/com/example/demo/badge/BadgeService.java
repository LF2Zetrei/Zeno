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

    /**
     * Crée un nouveau badge avec un nom et une description.
     *
     * @param name        le nom du badge
     * @param description la description du badge
     * @return le badge nouvellement créé et sauvegardé en base de données
     */
    public Badge createBadge(String name, String description) {
        Badge badge = new Badge();
        badge.setIdBadge(UUID.randomUUID());
        badge.setNom(name);
        badge.setDescription(description);
        return badgeRepository.save(badge);
    }

    /**
     * Attribue un badge à un utilisateur donné.
     *
     * @param badgeId l'identifiant du badge à attribuer
     * @param user    l'utilisateur à qui attribuer le badge
     * @throws RuntimeException si le badge n'existe pas ou si l'utilisateur a déjà ce badge
     */
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

    /**
     * Supprime l'attribution d'un badge pour un utilisateur donné.
     *
     * @param badgeId l'identifiant du badge à désassocier
     * @param user    l'utilisateur concerné
     * @throws RuntimeException si l'utilisateur ne possède pas ce badge
     */
    public void unAssignBadgeToUser(UUID badgeId, User user){
        UserBadge userBadge = userBadgeRepository.findByUser(user).stream()
                .filter(ub -> ub.getBadge().getIdBadge().equals(badgeId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User doesn't have this badge"));

        userBadgeRepository.delete(userBadge);
    }

    /**
     * Supprime un badge du système ainsi que toutes ses associations avec les utilisateurs.
     *
     * @param badgeId l'identifiant du badge à supprimer
     * @throws RuntimeException si le badge n'existe pas
     */
    public void deleteBadge(UUID badgeId) {
        Badge badge = badgeRepository.findByIdBadge(badgeId)
                .orElseThrow(() -> new RuntimeException("Badge not found"));

        // Supprimer tous les liens UserBadge associés à ce badge
        List<UserBadge> userBadges = userBadgeRepository.findByBadge(badge);
        userBadgeRepository.deleteAll(userBadges);

        // Supprimer le badge lui-même
        badgeRepository.delete(badge);
    }

    /**
     * Récupère la liste des badges associés à un utilisateur donné.
     *
     * @param user l'utilisateur dont on veut récupérer les badges
     * @return la liste des badges de l'utilisateur
     */
    public List<Badge> getUserBadges(User user) {
        return userBadgeRepository.findByUser(user).stream()
                .map(UserBadge::getBadge)
                .collect(Collectors.toList());
    }
}
