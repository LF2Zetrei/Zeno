package com.example.demo.payment;

import com.example.demo.mission.Mission;
import com.example.demo.mission.MissionRepository;
import com.example.demo.order.Order;
import com.example.demo.order.OrderRepository;
import com.example.demo.stripe.Pass;
import com.example.demo.stripe.PaymentIntentResponse;
import com.example.demo.stripe.StripeService;
import com.example.demo.user.User;
import com.example.demo.user.UserService;
import com.stripe.exception.StripeException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Controller REST gérant les opérations de paiement,
 * incluant la création d'intentions de paiement Stripe,
 * la mise à jour du statut des paiements, les remboursements,
 * et le transfert de fonds vers les livreurs.
 */
@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;
    private final StripeService stripeService;
    private final PaymentRepository paymentRepository;
    private final MissionRepository missionRepository;
    private final OrderRepository orderRepository;
    private final UserService userService;

    private static final Pass classic_pass = Pass.CLASSIC;
    private static final Pass premium_pass = Pass.PREMIUM;

    public PaymentController(PaymentService paymentService, StripeService stripeService, PaymentRepository paymentRepository, MissionRepository missionRepository, OrderRepository orderRepository, UserService userService) {
        this.paymentService = paymentService;
        this.stripeService = stripeService;
        this.paymentRepository = paymentRepository;
        this.missionRepository = missionRepository;
        this.orderRepository = orderRepository;
        this.userService = userService;
    }

    /**
     * Met à jour le statut du paiement associé à une mission donnée.
     *
     * @param authHeader  L'en-tête d'autorisation contenant le JWT.
     * @param missionId   L'identifiant unique de la mission concernée.
     * @return            La ressource Payment mise à jour encapsulée dans un ResponseEntity.
     */
    @PutMapping("/{missionId}/validate")
    public ResponseEntity<Payment> updatePaymentStatus(@RequestHeader("Authorization") String authHeader,@PathVariable UUID missionId) {
        return ResponseEntity.ok(paymentService.updatePaymentStatus(missionId));
    }

    /**
     * Marque le paiement d'une mission comme erroné en cas de problème.
     *
     * @param authHeader  L'en-tête d'autorisation contenant le JWT.
     * @param missionId   L'identifiant unique de la mission concernée.
     * @return            La ressource Payment mise à jour encapsulée dans un ResponseEntity.
     */
    @PutMapping("/{missionId}/error")
    public ResponseEntity<Payment> markAsError(@RequestHeader("Authorization") String authHeader,@PathVariable UUID missionId) {
        return ResponseEntity.ok(paymentService.wentWrong(missionId));
    }

    /**
     * Effectue un remboursement du paiement lié à une mission.
     *
     * @param authHeader  L'en-tête d'autorisation contenant le JWT.
     * @param missionId   L'identifiant unique de la mission concernée.
     * @return            La ressource Payment mise à jour encapsulée dans un ResponseEntity.
     */
    @PutMapping("/{missionId}/refund")
    public ResponseEntity<Payment> refund(@RequestHeader("Authorization") String authHeader,@PathVariable UUID missionId) {
        return ResponseEntity.ok(paymentService.refundPayment(missionId));
    }

    /**
     * Récupère le statut actuel du paiement d'une mission.
     *
     * @param authHeader  L'en-tête d'autorisation contenant le JWT.
     * @param missionId   L'identifiant unique de la mission concernée.
     * @return            Le statut du paiement sous forme de chaîne de caractères encapsulé dans un ResponseEntity.
     */
    @GetMapping("/{missionId}/status")
    public ResponseEntity<String> getStatus(@RequestHeader("Authorization") String authHeader,@PathVariable UUID missionId) {
        return ResponseEntity.ok(paymentService.getPaymentStatus(missionId));
    }

    /**
     * Crée une intention de paiement Stripe pour une mission spécifique.
     *
     * @param missionId   L'identifiant unique de la mission.
     * @param authHeader  L'en-tête d'autorisation contenant le JWT.
     * @return            Un map contenant le clientSecret pour la finalisation du paiement Stripe.
     * @throws StripeException Exception levée en cas de problème avec Stripe.
     */
    @PostMapping("/{missionId}/intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(
            @PathVariable UUID missionId,
            @RequestHeader("Authorization") String authHeader
    ) throws StripeException {
        String clientSecret = paymentService.createStripePaymentIntent(missionId);
        return ResponseEntity.ok(Map.of("clientSecret", clientSecret));
    }

    /**
     * Crée une intention de paiement pour l'achat d'un Classic Pass via Stripe.
     *
     * @param authHeader  L'en-tête d'autorisation contenant le JWT.
     * @return            Un map contenant le clientSecret et l'ID du PaymentIntent.
     */
    @PostMapping("/classicPass")
    public Map<String, String> createClassicPayment(@RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);
        PaymentIntentResponse paymentIntent = stripeService.createPaymentIntent(classic_pass.getPrice());

        stripeService.savePendingPayment(paymentIntent.getId(), user.getIdUser(), "classic");

        return Map.of(
                "clientSecret", paymentIntent.getClientSecret(),
                "paymentIntentId", paymentIntent.getId()
        );
    }

    /**
     * Crée une intention de paiement pour l'achat d'un Premium Pass via Stripe.
     *
     * @param authHeader  L'en-tête d'autorisation contenant le JWT.
     * @return            Un map contenant le clientSecret et l'ID du PaymentIntent.
     */
    @PostMapping("/premiumPass")
    public Map<String, String> createPremiumPayment(@RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);
        PaymentIntentResponse paymentIntent = stripeService.createPaymentIntent(premium_pass.getPrice());

        stripeService.savePendingPayment(paymentIntent.getId(), user.getIdUser(), "premium");

        return Map.of(
                "clientSecret", paymentIntent.getClientSecret(),
                "paymentIntentId", paymentIntent.getId()
        );
    }

    /**
     * Crée une intention de paiement Stripe pour une mission liée à une commande.
     *
     * @param authHeader  L'en-tête d'autorisation contenant le JWT.
     * @param orderId     L'identifiant unique de la commande associée à la mission.
     * @return            Un map contenant le clientSecret et l'ID du PaymentIntent.
     */
    @PostMapping("/pay_mission/{orderId}")
    public Map<String, String> createMissionPayment(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable UUID orderId
    ) {
        User user = userService.getUserByJwt(authHeader);

        // Créer le PaymentIntent et obtenir l'ID et le clientSecret
        PaymentIntentResponse paymentIntent = stripeService.createMissionPaymentIntentWithResponse(orderId);

        // Sauvegarder le paiement en attente avec l'utilisateur
        stripeService.savePendingPayment(paymentIntent.getId(), user.getIdUser(), "mission");

        return Map.of(
                "clientSecret", paymentIntent.getClientSecret(),
                "paymentIntentId", paymentIntent.getId()
        );
    }

    /**
     * Effectue le transfert de paiement au livreur pour une mission donnée.
     *
     * @param missionId   L'identifiant unique de la mission.
     * @param authHeader  L'en-tête d'autorisation contenant le JWT.
     * @return            Un ResponseEntity avec un message de succès ou d'erreur.
     */
    @PostMapping("/{missionId}/transfer")
    public ResponseEntity<String> payDeliverer(
            @PathVariable UUID missionId,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            stripeService.transferToDeliverer(missionId);
            return ResponseEntity.ok("Transfert effectué avec succès");
        } catch (StripeException e) {
            return ResponseEntity.status(500).body("Erreur Stripe : " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body("Erreur : " + e.getMessage());
        }
    }

}
