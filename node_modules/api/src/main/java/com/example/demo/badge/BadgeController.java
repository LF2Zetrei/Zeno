package com.example.demo.badge;

import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import com.example.demo.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/badge")

public class BadgeController {

    private final BadgeService badgeService;
    private final UserService userService;
    private final UserRepository userRepository;

    public BadgeController(BadgeService badgeService, UserService userService, UserRepository userRepository) {
        this.badgeService = badgeService;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public Badge createBadge(@RequestBody BadgeRequest request, @RequestHeader("Authorization") String authHeader) {
        return badgeService.createBadge(request.getName(), request.getDescription());
    }

    @PostMapping("/assign/{badgeId}/user/{userId}")
    public ResponseEntity<Void> assignBadgeToUser(@PathVariable UUID badgeId,
                                                  @PathVariable UUID userId,
                                                  @RequestHeader("Authorization") String authHeader) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        badgeService.assignBadgeToUser(badgeId, user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("unassign/{badgeId}")
    public ResponseEntity<Void> unassignBadgeFromUser(@PathVariable UUID badgeId,@RequestHeader("Authorization") String authHeader){
        User user = userService.getUserByJwt(authHeader);
        badgeService.unAssignBadgeToUser(badgeId, user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{badgeId}")
    public ResponseEntity<Void> deleteBadge(@PathVariable UUID badgeId, @RequestHeader("Authorization") String authHeader) {
        badgeService.deleteBadge(badgeId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public List<Badge> getUserBadges(@RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);
        return badgeService.getUserBadges(user);
    }

}

