package com.example.demo.mission;

import com.example.demo.user.User;
import com.example.demo.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/mission")
public class MissionController {

    private final MissionService missionService;
    private final MissionRepository missionRepository;
    private final UserService userService;

    public MissionController(MissionService missionService, MissionRepository missionRepository, UserService userService) {
        this.missionService = missionService;
        this.missionRepository = missionRepository;
        this.userService = userService;
    }

    @PutMapping("/{missionId}/status")
    public ResponseEntity<MissionResponse> updateStatus(@RequestHeader("Authorization") String authHeader,@PathVariable UUID missionId,
                                                @RequestParam String status) {
        return ResponseEntity.ok(missionService.updateMissionStatus(missionId, status));
    }

    @GetMapping("/{missionId}/status")
    public ResponseEntity<String> getStatus(@RequestHeader("Authorization") String authHeader,@PathVariable UUID missionId) {
        return ResponseEntity.ok(missionService.getMissionStatus(missionId));
    }

    @GetMapping("/{missionId}")
    public ResponseEntity<MissionResponse> getMissionById(@PathVariable UUID missionId) {
        return ResponseEntity.ok(missionService.getMissionById(missionId));
    }

    @DeleteMapping("/{missionId}")
    public ResponseEntity<Void> cancelMission(@PathVariable UUID missionId) {
        missionService.deleteMissionAndUpdateCommande(missionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<MissionResponse>> getAllMissions(@RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(missionService.getAllMissions());
    }

    @GetMapping("/all")
    public ResponseEntity<List<MissionResponse>> getMissionsAll(@RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(missionService.getPrivateMissions());
    }

    @GetMapping("/me")
    public ResponseEntity<List<MissionResponse>> getMyMissions(@RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);
        return ResponseEntity.ok(missionService.getMyMissions(user));
    }

    @PostMapping("/{missionId}/assign")
    public ResponseEntity<MissionResponse> assignDeliverer(@PathVariable UUID missionId,
                                                   @RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);
        return ResponseEntity.ok(missionService.assignDeliverer(missionId, user));
    }

    private String extractToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        throw new RuntimeException("Token manquant ou invalide");
    }

    @PostMapping("/{orderId}")
    public MissionResponse createMissionFromOrder(@PathVariable UUID orderId, @RequestHeader("Authorization") String authHeader) {
        return missionService.createMissionFromOrder(orderId);
    }

    @PutMapping("/{missionId}/unassign")
    public ResponseEntity<MissionResponse> unAssignDeliverer(@PathVariable UUID missionId,
                                                           @RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);
        return ResponseEntity.ok(missionService.unAssignDeliver(missionId, user));
    }
}