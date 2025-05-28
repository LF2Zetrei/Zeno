package com.example.demo.badge;

import com.example.demo.user.User;
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

    public BadgeController(BadgeService badgeService, UserService userService) {
        this.badgeService = badgeService;
        this.userService = userService;
    }

    @PostMapping
    public Badge createBadge(@RequestBody BadgeRequest request, @RequestHeader("Authorization") String authHeader) {
        return badgeService.createBadge(request.getName(), request.getDescription());
    }

    @PostMapping("/assign/{badgeId}")
    public ResponseEntity<Void> assignBadgeToUser(@PathVariable UUID badgeId,
                                                  @RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);
        badgeService.assignBadgeToUser(badgeId, user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public List<Badge> getUserBadges(@RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);
        return badgeService.getUserBadges(user);
    }

}

