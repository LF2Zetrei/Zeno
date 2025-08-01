package com.example.demo.user;

import com.example.demo.stripe.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final StripeService stripeService;

    /**
     * Constructeur du contrôleur utilisateur.
     *
     * @param userService Service métier utilisateur.
     * @param userRepository Repository utilisateur.
     * @param stripeService Service Stripe pour les opérations liées aux comptes et paiements.
     */
    public UserController(UserService userService, UserRepository userRepository, StripeService stripeService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.stripeService = stripeService;
    }

    /**
     * Récupère les informations de l'utilisateur courant (profil).
     *
     * @param authHeader Token JWT dans l'en-tête Authorization.
     * @return Données de l'utilisateur connecté.
     */
    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(@RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);
        return ResponseEntity.ok(user);
    }

    /**
     * Récupère la liste des meilleurs utilisateurs selon leur note.
     *
     * @return Liste de pseudos d'utilisateurs triés par moyenne de notation.
     */
    @GetMapping("/best")
    public ResponseEntity<List<String>> getBestUsers() {
        List<User> users = userService.getUsersByRatingAverage();
        List<String> bestUsers = new ArrayList<>();
        users.forEach(user -> bestUsers.add(user.getPseudo()));
        return ResponseEntity.ok(bestUsers);
    }

    /**
     * Met à jour le rôle de l'utilisateur connecté.
     * Si le rôle est "DELIVER", crée un compte Stripe et renvoie l'URL d'onboarding.
     *
     * @param authHeader Token JWT de l'utilisateur.
     * @param role Nouveau rôle à attribuer (ex. "DELIVER").
     * @return Message de confirmation ou URL d'onboarding Stripe.
     */
    @PutMapping("role")
    public ResponseEntity<?> updateRole(@RequestHeader("Authorization") String authHeader,
                                        @RequestParam String role) {
        User user = userService.getUserByJwt(authHeader);
        userService.updateUserRole(user, role);

        if ("DELIVER".equals(role)) {
            try {
                if (user.getStripeAccountId() == null) {
                    String accountId = stripeService.createStripeAccount(user);
                    user.setStripeAccountId(accountId);
                    userRepository.save(user);
                }

                String onboardingUrl = stripeService.createAccountLink(user.getStripeAccountId());

                return ResponseEntity.ok(Map.of(
                        "message", "Compte Stripe à configurer",
                        "onboardingUrl", onboardingUrl
                ));
            } catch (StripeException e) {
                return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
            }
        }

        return ResponseEntity.ok(Map.of("message", "Rôle mis à jour"));
    }

    /**
     * Met à jour la position géographique de l'utilisateur.
     *
     * @param authHeader JWT de l'utilisateur.
     * @param latitude Nouvelle latitude.
     * @param longitude Nouvelle longitude.
     * @return Utilisateur mis à jour.
     */
    @PutMapping("/position")
    public ResponseEntity<?> updatePosition(@RequestHeader("Authorization") String authHeader,
                                            @RequestParam Double latitude,
                                            @RequestParam Double longitude) {
        User user = userService.getUserByJwt(authHeader);
        userService.updateUserPosition(user, latitude, longitude);
        return ResponseEntity.ok(user);
    }

    /**
     * Met à jour les informations du profil utilisateur.
     *
     * @param authHeader JWT de l'utilisateur.
     * @param updateRequest Données de mise à jour.
     * @return Utilisateur mis à jour.
     */
    @PutMapping("/update")
    public ResponseEntity<?> updateMyProfile(@RequestHeader("Authorization") String authHeader,
                                             @RequestBody UpdateUserRequest updateRequest) {
        User user = userService.getUserByJwt(authHeader);
        User updatedUser = userService.updateUserProfile(user, updateRequest);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Met à jour l'abonnement de l'utilisateur après validation du paiement Stripe.
     *
     * @param request Objet contenant le type d'abonnement et l'ID du PaymentIntent Stripe.
     * @param authHeader JWT de l'utilisateur.
     * @return Réponse HTTP : 200 si succès, 403 si échec.
     * @throws StripeException en cas d’erreur de communication avec Stripe.
     */
    @PutMapping("/user/subscription")
    public ResponseEntity<?> updateSubscription(@RequestBody SubscriptionRequest request,
                                                @RequestHeader("Authorization") String authHeader)
            throws StripeException {
        User user = userService.getUserByJwt(authHeader);

        PaymentIntent intent = PaymentIntent.retrieve(request.getPaymentIntentId());
        if (!"succeeded".equals(intent.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Paiement non validé");
        }

        if (!stripeService.isPaymentIntentLinkedToUser(intent.getId(), user.getIdUser())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Ce paiement ne vous appartient pas");
        }

        userService.updateSubscription(request.getSubscriptionType(), user);
        return ResponseEntity.ok().build();
    }

    /**
     * Permet à un utilisateur de noter un autre utilisateur.
     *
     * @param authHeader JWT de l’utilisateur notant.
     * @param rate Note donnée (entre 0 et 5 typiquement).
     * @param userName Nom de l'utilisateur à noter.
     * @return Utilisateur mis à jour avec la nouvelle note.
     */
    @PutMapping("/rate")
    public ResponseEntity<?> rateUser(@RequestHeader("Authorization") String authHeader,
                                      @RequestParam("rate") Float rate,
                                      @RequestParam("userName") String userName) {
        userService.rateUser(userName, rate);
        User updatedUser = userRepository.findByPseudo(userName).orElse(null);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Supprime le compte de l'utilisateur connecté.
     *
     * @param authHeader JWT de l'utilisateur.
     * @return Message de confirmation.
     */
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteMyProfile(@RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);
        userService.deleteUser(user);
        return ResponseEntity.ok("User deleted successfully");
    }

    /**
     * Valide l'identité d’un utilisateur manuellement (ex. via back-office).
     *
     * @param authHeader JWT de l'utilisateur.
     * @return 200 OK si succès.
     */
    @PutMapping("/validate-identity")
    public ResponseEntity<?> validateIdentity(@RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);
        user.setIdentityCardUrl("validé");
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }
}
