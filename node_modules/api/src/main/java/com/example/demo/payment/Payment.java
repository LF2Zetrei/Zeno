package com.example.demo.payment;

import com.example.demo.mission.Mission;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payment")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Payment {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "id_payment", nullable = false, unique = true)
    private UUID idPayment;

    @Column
    private Float amount;
    private String status;

    private UUID userId;

    @Column(name = "stripe_id")
    private String stripeId;

    @OneToOne
    @JoinColumn(name = "mission_id", nullable = true)
    private Mission mission;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public void setUserId(UUID userId) {
        this.userId = userId;
    }
    public UUID getUserId() {
        return userId;
    }
    public Float getAmount() {
        return amount;
    }

    public void setAmount(Float amount) {
        this.amount = amount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public UUID getIdPayment() {
        return idPayment;
    }

    public void setIdPayment(UUID idPayment) {
        this.idPayment = idPayment;
    }

    public Mission getMission() {
        return mission;
    }

    public void setMission(Mission mission) {
        this.mission = mission;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStripeId() {
        return stripeId;
    }

    public void setStripeId(String stripeId) {
        this.stripeId = stripeId;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}