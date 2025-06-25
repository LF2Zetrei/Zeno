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

    public TrackingController(TrackingService trackingService, TrackingRepository trackingRepository) {
        this.trackingService = trackingService;
        this.trackingRepository = trackingRepository;
    }

    @PutMapping("/update")
    public ResponseEntity<Tracking> updateTracking(@RequestParam UUID missionId,
                                                   @RequestParam Float latitude,
                                                   @RequestParam Float longitude,
    @RequestHeader("Authorization") String authHeader) {
        Tracking tracking = trackingService.updateTracking(missionId, latitude, longitude);
        return ResponseEntity.ok(tracking);
    }

    @GetMapping("/{missionId}/positions")
    public ResponseEntity<TrackingResponseDto> getTrackingPositions(@PathVariable UUID missionId, @RequestHeader("Authorization") String authHeader) {

        return ResponseEntity.ok(trackingService.getTrackingInfo(missionId));
    }
}

