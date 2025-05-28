package com.example.demo.mission;

import com.example.demo.tracking.Tracking;
import com.example.demo.order.Order;
import com.example.demo.user.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "mission")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Mission {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "id_mission", nullable = false, unique = true)
    private UUID idMission;

    @ManyToOne
    @JoinColumn(name = "traveler_id", nullable = true)
    private User traveler;

    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "acceptance_date")
    private LocalDate acceptanceDate;

    @Enumerated(EnumType.STRING)
    private MissionStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "public")
    private Boolean isPublic;

    public Boolean getIsPublic() {
        return isPublic;
    }
    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public void setStatus(MissionStatus status) {
        this.status = status;
    }
    public MissionStatus getStatus() { return status; }

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