package com.example.demo.tracking;

import com.example.demo.mission.Mission;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tracking")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Tracking {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "id_tracking", nullable = false, unique = true)
    private UUID idTracking;

    @OneToOne
    @JoinColumn(name = "mission_id", nullable = false)
    private Mission mission;

    private Float latitude;
    private Float longitude;

    private LocalDateTime timestamp;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public UUID getIdTracking() {
        return idTracking;
    }

    public void setIdTracking(UUID idTracking) {
        this.idTracking = idTracking;
    }

    public Float getLatitude() {
        return latitude;
    }

    public void setLatitude(Float latitude) {
        this.latitude = latitude;
    }

    public Float getLongitude() {
        return longitude;
    }

    public void setLongitude(Float longitude) {
        this.longitude = longitude;
    }

    public Mission getMission() {
        return mission;
    }

    public void setMission(Mission mission) {
        this.mission = mission;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
