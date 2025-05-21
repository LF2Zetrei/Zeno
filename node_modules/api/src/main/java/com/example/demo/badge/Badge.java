package com.example.demo.badge;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "badge")
public class Badge {

    @Id
    @Column(name = "id_badge", nullable = false, unique = true)
    private UUID idBadge;

    private String nom;
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Getters, setters, constructeurs omis
}
