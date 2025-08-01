package com.example.demo.notification;

import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Crée une nouvelle notification pour un utilisateur donné.
     * @param user L'utilisateur destinataire
     * @param title Le titre de la notification
     * @param message Le message de la notification
     * @return La notification créée et sauvegardée
     */
    public Notification createNotification(User user, String title, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        return notificationRepository.save(notification);
    }

    /**
     * Récupère la liste des notifications d'un utilisateur, triées par date de création décroissante.
     * @param user L'utilisateur dont on veut les notifications
     * @return La liste des notifications
     */
    public List<Notification> getNotificationsByUser(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    /**
     * Marque une notification comme lue.
     * @param notificationId L'ID de la notification à marquer
     * @return La notification mise à jour
     * @throws RuntimeException si la notification n'existe pas
     */
    public Notification markAsRead(UUID notificationId) {
        Notification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notif.setRead(true);
        return notificationRepository.save(notif);
    }

    /**
     * Supprime une notification donnée.
     * @param notificationId L'ID de la notification à supprimer
     */
    public void deleteNotification(UUID notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    /**
     * Compte le nombre de notifications non lues pour un utilisateur donné.
     * @param userId ID de l'utilisateur
     * @return Le nombre de notifications non lues
     */
    public long getUnreadCount(UUID userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }
}
