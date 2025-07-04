package com.example.demo.stripe;

import com.example.demo.user.User;
import com.example.demo.user.UserService;
import com.stripe.exception.StripeException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/stripe")
public class StripeController {
    private final UserService userService;
    private final StripeService stripeService;

    public StripeController(UserService userService, StripeService stripeService) {
        this.userService = userService;
        this.stripeService = stripeService;
    }

    @PostMapping("/identity-session")
    public ResponseEntity<?> createIdentitySession(@RequestHeader("Authorization") String authHeader) {
        try {
            User user = userService.getUserByJwt(authHeader.replace("Bearer ", ""));
            String sessionUrl = stripeService.createIdentitySession(user.getIdUser());
            return ResponseEntity.ok(Map.of("url", sessionUrl));
        } catch (StripeException e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/create_stripe_account")
    public String createStripeAccount(@RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);

        if (user.getStripeAccountId() != null) {
            return "Compte Stripe déjà créé : " + user.getStripeAccountId();
        }

        try {
            String accountId = stripeService.createConnectedAccountForUser(user);
            return "Compte Stripe connecté créé : " + accountId;
        } catch (StripeException e) {
            throw new RuntimeException("Erreur lors de la création du compte Stripe", e);
        }
    }


}
