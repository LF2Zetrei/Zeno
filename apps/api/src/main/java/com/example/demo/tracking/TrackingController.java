package com.example.demo.tracking;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tracking")
public class TrackingController {

    private final TrackingService trackingService;
    private final TrackingRepository trackingRepository;

    /**
     * Constructeur du contrôleur de suivi de position.
     *
     * @param trackingService Service métier de tracking.
     * @param trackingRepository Repository d'accès aux données de tracking.
     */
    public TrackingController(TrackingService trackingService, TrackingRepository trackingRepository) {
        this.trackingService = trackingService;
        this.trackingRepository = trackingRepository;
    }

    /**
     * Met à jour la position actuelle d’une mission (géolocalisation du livreur).
     *
     * @param missionId ID de la mission.
     * @param latitude Latitude GPS du livreur.
     * @param longitude Longitude GPS du livreur.
     * @param authHeader En-tête d'autorisation JWT.
     * @return Objet Tracking mis à jour.
     */
    @PutMapping("/update")
    public ResponseEntity<Tracking> updateTracking(@RequestParam UUID missionId,
                                                   @RequestParam Float latitude,
                                                   @RequestParam Float longitude,
                                                   @RequestHeader("Authorization") String authHeader) {
        Tracking tracking = trackingService.updateTracking(missionId, latitude, longitude);
        return ResponseEntity.ok(tracking);
    }

    /**
     * Récupère l’historique de positions GPS pour une mission donnée.
     *
     * @param missionId ID de la mission.
     * @param authHeader En-tête d'autorisation JWT.
     * @return DTO contenant la liste des positions enregistrées.
     */
    @GetMapping("/{missionId}/positions")
    public ResponseEntity<TrackingResponseDto> getTrackingPositions(@PathVariable UUID missionId,
                                                                    @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(trackingService.getTrackingInfo(missionId));
    }
}
