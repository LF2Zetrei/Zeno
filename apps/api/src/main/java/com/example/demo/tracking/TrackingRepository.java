package com.example.demo.tracking;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TrackingRepository extends JpaRepository<Tracking, UUID> {
    List<Tracking> findByMission_IdMissionOrderByTimestampAsc(UUID missionId);
}
