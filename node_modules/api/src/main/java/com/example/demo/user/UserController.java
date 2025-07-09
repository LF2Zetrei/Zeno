package com.example.demo.user;

import com.example.demo.stripe.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final StripeService stripeService;

    public UserController(UserService userService, UserRepository userRepository, StripeService stripeService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.stripeService = stripeService;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(@RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/best")
    public ResponseEntity<List<String>> getBestUsers() {
        List<User> users = userService.getUsersByRatingAverage();
        List<String> bestUsers = new ArrayList<>();
        users.forEach(user -> { bestUsers.add(user.getPseudo());});
        return ResponseEntity.ok(bestUsers);
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

    @PutMapping("/user/subscription")
    public ResponseEntity<?> updateSubscription(
            @RequestBody SubscriptionRequest request,
            @RequestHeader("Authorization") String authHeader
    ) throws StripeException {
        User user = userService.getUserByJwt(authHeader);

        // Vérifie le statut du PaymentIntent
        PaymentIntent intent = PaymentIntent.retrieve(request.getPaymentIntentId());
        if (!"succeeded".equals(intent.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Paiement non validé");
        }

        // Optionnel : vérifier que ce PaymentIntent correspond bien à l'utilisateur
        if (!stripeService.isPaymentIntentLinkedToUser(intent.getId(), user.getIdUser())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Ce paiement ne vous appartient pas");
        }

        // OK : met à jour l’abonnement
        userService.updateSubscription(request.getSubscriptionType(), user);
        return ResponseEntity.ok().build();
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

    @PutMapping("/validate-identity")
    public ResponseEntity<?> validateIdentity(@RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);
        user.setIdentityCardUrl("validé");
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

}
