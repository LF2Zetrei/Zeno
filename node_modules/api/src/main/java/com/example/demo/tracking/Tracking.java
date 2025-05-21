package com.example.demo.tracking;

import com.example.demo.mission.Mission;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tracking")
public class Tracking {

    @Id
    @Column(name = "id_tracking", nullable = false, unique = true)
    private UUID idTracking;

    @ManyToOne
    @JoinColumn(name = "mission_id", nullable = false)
    private Mission mission;

    private Float latitude;
    private Float longitude;

    private LocalDateTime timestamp;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Getters, setters, constructors omis
}
