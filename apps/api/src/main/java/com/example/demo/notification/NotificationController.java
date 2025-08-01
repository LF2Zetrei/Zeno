package com.example.demo.notification;

import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import com.example.demo.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notification")  // Définit la route principale pour toutes les requêtes liées aux notifications
public class NotificationController {

    @Autowired
    private NotificationService notificationService;  // Service métier pour gérer les notifications

    @Autowired
    private UserService userService;  // Service utilisateur pour récupérer l'utilisateur à partir du JWT

    @Autowired
    private UserRepository userRepository;  // Repository pour accéder directement aux données utilisateurs

    /**
     * Crée une nouvelle notification pour un utilisateur donné.
     * @param authHeader Le header Authorization pour vérifier l'authentification (JWT)
     * @param title Le titre de la notification
     * @param message Le contenu/message de la notification
     * @param userId L'ID de l'utilisateur destinataire
     * @return La notification créée avec un code HTTP 200
     */
    @PostMapping("/{userId}")
    public ResponseEntity<Notification> createNotification(@RequestHeader("Authorization") String authHeader,
                                                           @RequestParam String title,
                                                           @RequestParam String message,
                                                           @PathVariable UUID userId) {
        // Récupération de l'utilisateur destinataire par son ID
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        // Création et retour de la notification
        return ResponseEntity.ok(notificationService.createNotification(user, title, message));
    }

    /**
     * Récupère toutes les notifications pour l'utilisateur authentifié.
     * @param authHeader Header Authorization contenant le JWT
     * @return Liste des notifications de l'utilisateur avec code HTTP 200
     */
    @GetMapping("/{user}")
    public ResponseEntity<List<Notification>> getUserNotifications(@RequestHeader("Authorization") String authHeader) {
        // Récupération de l'utilisateur connecté à partir du JWT
        User user = userService.getUserByJwt(authHeader);
        // Récupération et renvoi des notifications pour cet utilisateur
        return ResponseEntity.ok(notificationService.getNotificationsByUser(user));
    }

    /**
     * Marque une notification comme lue.
     * @param authHeader Header Authorization (JWT)
     * @param notificationId ID de la notification à marquer comme lue
     * @return La notification mise à jour avec code HTTP 200
     */
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Notification> markAsRead(@RequestHeader("Authorization") String authHeader,
                                                   @PathVariable UUID notificationId) {
        // Appel au service pour marquer la notification comme lue
        return ResponseEntity.ok(notificationService.markAsRead(notificationId));
    }

    /**
     * Supprime une notification par son ID.
     * @param authHeader Header Authorization (JWT)
     * @param notificationId ID de la notification à supprimer
     * @return Réponse HTTP 204 No Content en cas de succès
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<?> deleteNotification(@RequestHeader("Authorization") String authHeader,
                                                @PathVariable UUID notificationId) {
        // Suppression de la notification via le service
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Récupère le nombre de notifications non lues pour l'utilisateur connecté.
     * @param authHeader Header Authorization (JWT)
     * @return Nombre de notifications non lues avec code HTTP 200
     */
    @GetMapping("/user/unread-count")
    public ResponseEntity<Long> getUnreadCount(@RequestHeader("Authorization") String authHeader) {
        // Récupération de l'utilisateur via JWT
        User user = userService.getUserByJwt(authHeader);
        // Retourne le nombre de notifications non lues
        return ResponseEntity.ok(notificationService.getUnreadCount(user.getIdUser()));
    }
}
