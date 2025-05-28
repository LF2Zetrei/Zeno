package com.example.demo.mission;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class MissionResponse {
    private UUID idMission;
    private UUID travelerId;
    private String travelerPseudo;
    private UUID orderId;
    private LocalDate acceptanceDate;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public UUID getIdMission() {
        return idMission;
    }

    public void setIdMission(UUID idMission) {
        this.idMission = idMission;
    }

    public UUID getTravelerId() {
        return travelerId;
    }

    public void setTravelerId(UUID travelerId) {
        this.travelerId = travelerId;
    }

    public String getTravelerPseudo() {
        return travelerPseudo;
    }

    public void setTravelerPseudo(String travelerPseudo) {
        this.travelerPseudo = travelerPseudo;
    }

    public UUID getOrderId() {
        return orderId;
    }

    public void setOrderId(UUID orderId) {
        this.orderId = orderId;
    }

    public LocalDate getAcceptanceDate() {
        return acceptanceDate;
    }

    public void setAcceptanceDate(LocalDate acceptanceDate) {
        this.acceptanceDate = acceptanceDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
