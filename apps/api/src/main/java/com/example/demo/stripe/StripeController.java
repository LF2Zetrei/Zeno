package com.example.demo.stripe;

import com.example.demo.user.User;
import com.example.demo.user.UserService;
import com.stripe.exception.StripeException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Contrôleur REST dédié aux opérations Stripe :
 * création de sessions d'identité et de comptes Stripe.
 */
@RestController
@RequestMapping("/api/stripe")
public class StripeController {

    private final UserService userService;
    private final StripeService stripeService;

    /**
     * Constructeur injectant les services nécessaires.
     *
     * @param userService   Service de gestion des utilisateurs.
     * @param stripeService Service de gestion des appels à l'API Stripe.
     */
    public StripeController(UserService userService, StripeService stripeService) {
        this.userService = userService;
        this.stripeService = stripeService;
    }

    /**
     * Crée une session d'identité Stripe pour l'utilisateur authentifié.
     * Cette session permet à Stripe de vérifier l'identité de l'utilisateur (ex: KYC).
     *
     * @param authHeader En-tête d'autorisation contenant le token JWT (Bearer ...).
     * @return           Une réponse contenant l'URL de la session Stripe ou une erreur.
     */
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

    /**
     * Crée un compte Stripe Express pour l'utilisateur authentifié,
     * utilisé notamment pour les transferts de fonds.
     *
     * @param authHeader En-tête d'autorisation contenant le token JWT.
     * @return           Une réponse contenant le message de succès ou d'erreur.
     */
    @PostMapping("/create_stripe_account")
    public ResponseEntity<?> createStripeAccount(@RequestHeader("Authorization") String authHeader) {
        try {
            User user = userService.getUserByJwt(authHeader);
            String result = stripeService.handleStripeAccountCreation(user);
            return ResponseEntity.ok(Map.of("message", result));
        } catch (StripeException e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

}
