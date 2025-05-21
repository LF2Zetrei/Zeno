package com.example.demo.tracking;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tracking")
public class TrackingController {

    private final TrackingService trackingService;

    public TrackingController(TrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @PostMapping("/create")
    public ResponseEntity<Tracking> createTracking(@RequestParam UUID missionId,
                                                   @RequestParam Float latitude,
                                                   @RequestParam Float longitude) {
        Tracking tracking = trackingService.createTracking(missionId, latitude, longitude);
        return ResponseEntity.ok(tracking);
    }

    @PutMapping("/{trackingId}/update")
    public ResponseEntity<Tracking> updateTracking(@RequestParam UUID missionId,
                                                   @PathVariable UUID trackingId,
                                                   @RequestParam Float latitude,
                                                   @RequestParam Float longitude) {
        Tracking tracking = trackingService.updateTracking(missionId, trackingId, latitude, longitude);
        return ResponseEntity.ok(tracking);
    }

    @GetMapping("/{missionId}/positions")
    public ResponseEntity<List<Tracking>> getTrackingPositions(@PathVariable UUID missionId) {
        List<Tracking> positions = trackingService.getTrackingPositions(missionId);
        return ResponseEntity.ok(positions);
    }
}
