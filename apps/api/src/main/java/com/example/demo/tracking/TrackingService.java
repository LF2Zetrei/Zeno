package com.example.demo.tracking;

import com.example.demo.mission.Mission;
import com.example.demo.mission.MissionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class TrackingService {

    private final TrackingRepository trackingRepository;
    private final MissionRepository missionRepository;

    /**
     * Constructeur du service de tracking.
     *
     * @param trackingRepository Repository de tracking.
     * @param missionRepository Repository des missions.
     */
    public TrackingService(TrackingRepository trackingRepository,
                           MissionRepository missionRepository) {
        this.trackingRepository = trackingRepository;
        this.missionRepository = missionRepository;
    }

    /**
     * Crée une nouvelle entrée de géolocalisation pour une mission.
     *
     * @param missionId ID de la mission.
     * @param latitude Latitude GPS.
     * @param longitude Longitude GPS.
     * @return Tracking sauvegardé.
     * @throws RuntimeException si la mission n’est pas trouvée.
     */
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

    /**
     * Met à jour la dernière position connue d’une mission.
     *
     * @param missionId ID de la mission.
     * @param latitude Nouvelle latitude GPS.
     * @param longitude Nouvelle longitude GPS.
     * @return Objet Tracking mis à jour.
     * @throws RuntimeException si la mission ou le tracking n’existe pas ou ne correspond pas.
     */
    @Transactional
    public Tracking updateTracking(UUID missionId, Float latitude, Float longitude) {
        Mission mission = missionRepository.findByIdMission(missionId)
                .orElseThrow(() -> new RuntimeException("Mission introuvable"));

        Tracking tracking = trackingRepository.findByMission(mission)
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

    /**
     * Récupère les coordonnées GPS actuelles d’une mission.
     *
     * @param missionId ID de la mission.
     * @return DTO contenant la latitude et la longitude.
     * @throws RuntimeException si le tracking ou la mission est introuvable.
     */
    public TrackingResponseDto getTrackingInfo(UUID missionId) {
        Mission mission = missionRepository.findByIdMission(missionId)
                .orElseThrow(() -> new RuntimeException("Tracking not found"));

        Tracking tracking = trackingRepository.findByMission(mission)
                .orElseThrow(() -> new RuntimeException("Tracking not found"));

        System.out.println("[getTrackingInfo] Latitude : " + tracking.getLatitude() + ", Longitude : " + tracking.getLongitude());

        return new TrackingResponseDto(
                tracking.getLatitude(),
                tracking.getLongitude()
        );
    }
}
