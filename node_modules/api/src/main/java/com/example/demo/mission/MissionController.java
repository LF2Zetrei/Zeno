package com.example.demo.mission;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/missions")
public class MissionController {

    private final MissionService missionService;

    public MissionController(MissionService missionService) {
        this.missionService = missionService;
    }

    @PostMapping("/create")
    public ResponseEntity<Mission> createMission(@RequestParam UUID orderId) {
        return ResponseEntity.ok(missionService.createMission(orderId));
    }

    @PutMapping("/{missionId}/status")
    public ResponseEntity<Mission> updateStatus(@PathVariable UUID missionId,
                                                @RequestParam String status) {
        return ResponseEntity.ok(missionService.updateMissionStatus(missionId, status));
    }

    @GetMapping("/{missionId}/status")
    public ResponseEntity<String> getStatus(@PathVariable UUID missionId) {
        return ResponseEntity.ok(missionService.getMissionStatus(missionId));
    }

    @DeleteMapping("/{missionId}")
    public ResponseEntity<Void> cancelMission(@PathVariable UUID missionId) {
        missionService.cancelMission(missionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Mission>> getAllMissions() {
        return ResponseEntity.ok(missionService.getAllMissions());
    }

    @GetMapping("/me")
    public ResponseEntity<List<Mission>> getMyMissions(@RequestHeader("Authorization") String authHeader) {
        String jwt = extractToken(authHeader);
        return ResponseEntity.ok(missionService.getMyMissions(jwt));
    }

    @PostMapping("/{missionId}/assign")
    public ResponseEntity<Mission> assignDeliverer(@PathVariable UUID missionId,
                                                   @RequestHeader("Authorization") String authHeader) {
        String jwt = extractToken(authHeader);
        return ResponseEntity.ok(missionService.assignDeliverer(missionId, jwt));
    }

    private String extractToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        throw new RuntimeException("Token manquant ou invalide");
    }
}