package com.example.demo.mission;

import com.example.demo.tracking.Tracking;
import com.example.demo.order.Order;
import com.example.demo.user.User;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "mission")
public class Mission {

    @Id
    @Column(name = "id_mission", nullable = false, unique = true)
    private UUID idMission;

    @ManyToOne
    @JoinColumn(name = "traveler_id", nullable = false)
    private User traveler;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @OneToOne
    @JoinColumn(name = "tracking_id")
    private Tracking tracking;

    @Column(name = "acceptance_date")
    private LocalDate acceptanceDate;

    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public LocalDate getAcceptanceDate() {
        return acceptanceDate;
    }

    public void setAcceptanceDate(LocalDate acceptanceDate) {
        this.acceptanceDate = acceptanceDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public UUID getIdMission() {
        return idMission;
    }

    public void setIdMission(UUID idMission) {
        this.idMission = idMission;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Tracking getTracking() {
        return tracking;
    }

    public void setTracking(Tracking tracking) {
        this.tracking = tracking;
    }

    public User getTraveler() {
        return traveler;
    }

    public void setTraveler(User traveler) {
        this.traveler = traveler;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}