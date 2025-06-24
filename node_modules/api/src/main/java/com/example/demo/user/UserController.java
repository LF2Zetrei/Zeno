package com.example.demo.user;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(@RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/best")
    public ResponseEntity<List<User>> getBestUsers() {
        List<User> users = userService.getUsersByRatingAverage();
        return ResponseEntity.ok(users);
    }

    @PutMapping("role")
    public ResponseEntity<?> updateRole(@RequestHeader("Authorization") String authHeader, @RequestParam String role) {
        User user = userService.getUserByJwt(authHeader);

            userService.updateUserRole(user, role);


        return ResponseEntity.ok(user);
    }
    @PutMapping("/position")
    public ResponseEntity<?> updatePosition(@RequestHeader("Authorization") String authHeader, @RequestParam Double latitude, @RequestParam Double longitude) {
        User user = userService.getUserByJwt(authHeader);
        userService.updateUserPosition(user, latitude, longitude);
        return ResponseEntity.ok(user);
    }
    @PutMapping("/update")
    public ResponseEntity<?> updateMyProfile(@RequestHeader("Authorization") String authHeader,
                                             @RequestBody UpdateUserRequest updateRequest) {
        User user = userService.getUserByJwt(authHeader);
        User updatedUser = userService.updateUserProfile(user, updateRequest);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/subscription")
    public ResponseEntity<?> updateSubscription(@RequestHeader("Authorization") String authHeader,
                                             @RequestParam("subscriptionType") String subscriptionType) {
        User user = userService.getUserByJwt(authHeader);
        userService.updateSubscription(subscriptionType, user);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/rate")
    public ResponseEntity<?> rateUser(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("rate") Float rate,
            @RequestParam("userName") String userName) {

        // Appel au service pour mettre à jour la note
        userService.rateUser(userName, rate);

        // Récupérer l'utilisateur mis à jour pour retourner la réponse (optionnel)
        User updatedUser = userRepository.findByPseudo(userName).orElse(null);

        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteMyProfile(@RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);
        userService.deleteUser(user);
        return ResponseEntity.ok("User deleted successfully");
    }

}
