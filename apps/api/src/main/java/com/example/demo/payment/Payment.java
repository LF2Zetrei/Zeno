package com.example.demo.payment;

import com.example.demo.mission.Mission;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payment")
public class Payment {

    @Id
    @Column(name = "id_payment", nullable = false, unique = true)
    private UUID idPayment;

    private Float amount;
    private String status;

    @Column(name = "stripe_id")
    private String stripeId;

    @ManyToOne
    @JoinColumn(name = "mission_id", nullable = false)
    private Mission mission;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Getters, setters, constructeurs omis
}