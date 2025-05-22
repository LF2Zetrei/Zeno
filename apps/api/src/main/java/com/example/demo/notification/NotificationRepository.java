package com.example.demo.notification;

import com.example.demo.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.idUser = :userId AND n.isRead = false")
    long countUnreadByUserId(@Param("userId") UUID userId);
}
