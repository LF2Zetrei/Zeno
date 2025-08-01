package com.example.demo.badge;

import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import com.example.demo.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/badge")
public class BadgeController {

    private final BadgeService badgeService;
    private final UserService userService;
    private final UserRepository userRepository;

    public BadgeController(BadgeService badgeService, UserService userService, UserRepository userRepository) {
        this.badgeService = badgeService;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    /**
     * Crée un nouveau badge à partir des informations fournies dans la requête.
     *
     * @param request   les informations du badge à créer (nom et description)
     * @param authHeader le jeton JWT de l'utilisateur effectuant l'action
     * @return le badge nouvellement créé
     */
    @PostMapping
    public Badge createBadge(@RequestBody BadgeRequest request, @RequestHeader("Authorization") String authHeader) {
        return badgeService.createBadge(request.getName(), request.getDescription());
    }

    /**
     * Associe un badge à un utilisateur donné.
     *
     * @param badgeId    l'identifiant du badge à attribuer
     * @param userId     l'identifiant de l'utilisateur à qui le badge est attribué
     * @param authHeader le jeton JWT de l'utilisateur effectuant l'action
     * @return une réponse HTTP 200 si l'opération est réussie
     */
    @PostMapping("/assign/{badgeId}/user/{userId}")
    public ResponseEntity<Void> assignBadgeToUser(@PathVariable UUID badgeId,
                                                  @PathVariable UUID userId,
                                                  @RequestHeader("Authorization") String authHeader) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        badgeService.assignBadgeToUser(badgeId, user);
        return ResponseEntity.ok().build();
    }

    /**
     * Supprime l'attribution d'un badge au profil de l'utilisateur connecté.
     *
     * @param badgeId    l'identifiant du badge à désassocier
     * @param authHeader le jeton JWT de l'utilisateur concerné
     * @return une réponse HTTP 200 si l'opération est réussie
     */
    @DeleteMapping("unassign/{badgeId}")
    public ResponseEntity<Void> unassignBadgeFromUser(@PathVariable UUID badgeId, @RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);
        badgeService.unAssignBadgeToUser(badgeId, user);
        return ResponseEntity.ok().build();
    }

    /**
     * Supprime définitivement un badge du système.
     *
     * @param badgeId    l'identifiant du badge à supprimer
     * @param authHeader le jeton JWT de l'utilisateur effectuant l'action
     * @return une réponse HTTP 204 (No Content) si la suppression est réussie
     */
    @DeleteMapping("/{badgeId}")
    public ResponseEntity<Void> deleteBadge(@PathVariable UUID badgeId, @RequestHeader("Authorization") String authHeader) {
        badgeService.deleteBadge(badgeId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Récupère la liste des badges associés à l'utilisateur connecté.
     *
     * @param authHeader le jeton JWT de l'utilisateur connecté
     * @return la liste des badges de l'utilisateur
     */
    @GetMapping("/me")
    public List<Badge> getUserBadges(@RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);
        return badgeService.getUserBadges(user);
    }

}
