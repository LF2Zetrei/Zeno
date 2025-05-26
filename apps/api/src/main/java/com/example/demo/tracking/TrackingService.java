package com.example.demo.tracking;

import com.example.demo.mission.Mission;
import com.example.demo.mission.MissionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TrackingService {

    private final TrackingRepository trackingRepository;
    private final MissionRepository missionRepository;

    public TrackingService(TrackingRepository trackingRepository,
                           MissionRepository missionRepository) {
        this.trackingRepository = trackingRepository;
        this.missionRepository = missionRepository;
    }

    @Transactional
    public Tracking createTracking(UUID missionId, Float latitude, Float longitude) {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission non trouvée"));

        Tracking tracking = new Tracking();
        tracking.setIdTracking(UUID.randomUUID());
        tracking.setMission(mission);
        tracking.setLatitude(latitude);
        tracking.setLongitude(longitude);
        tracking.setTimestamp(LocalDateTime.now());
        tracking.setCreatedAt(LocalDateTime.now());
        tracking.setUpdatedAt(LocalDateTime.now());

        return trackingRepository.save(tracking);
    }

    @Transactional
    public Tracking updateTracking(UUID missionId, UUID trackingId, Float latitude, Float longitude) {
        Tracking tracking = trackingRepository.findById(trackingId)
                .orElseThrow(() -> new RuntimeException("Tracking non trouvé"));

        if (!tracking.getMission().getIdMission().equals(missionId)) {
            throw new RuntimeException("Tracking ne correspond pas à la mission");
        }

        tracking.setLatitude(latitude);
        tracking.setLongitude(longitude);
        tracking.setTimestamp(LocalDateTime.now());
        tracking.setUpdatedAt(LocalDateTime.now());

        return trackingRepository.save(tracking);
    }

    /* à modifier */
    public List<Tracking> getTrackingPositions(UUID missionId) {
        return trackingRepository.findByMission_IdMissionOrderByTimestampAsc(missionId);
    }
}