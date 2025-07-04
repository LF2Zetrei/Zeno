package com.example.demo.payment;

import com.example.demo.mission.Mission;
import com.example.demo.mission.MissionRepository;
import com.example.demo.order.Order;
import com.example.demo.order.OrderRepository;
import com.example.demo.stripe.Pass;
import com.example.demo.stripe.PaymentIntentResponse;
import com.example.demo.stripe.StripeService;
import com.example.demo.user.User;
import com.stripe.exception.StripeException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;
    private final StripeService stripeService;
    private final PaymentRepository paymentRepository;
    private final MissionRepository missionRepository;
    private final OrderRepository orderRepository;

    public PaymentController(PaymentService paymentService, StripeService stripeService, PaymentRepository paymentRepository, MissionRepository missionRepository, OrderRepository orderRepository) {
        this.paymentService = paymentService;
        this.stripeService = stripeService;
        this.paymentRepository = paymentRepository;
        this.missionRepository = missionRepository;
        this.orderRepository = orderRepository;
    }

    private static final Pass classic_pass = Pass.CLASSIC;
    private static final Pass premium_pass = Pass.PREMIUM;


    // 2. Update_payment_status
    @PutMapping("/{missionId}/validate")
    public ResponseEntity<Payment> updatePaymentStatus(@RequestHeader("Authorization") String authHeader,@PathVariable UUID missionId) {
        return ResponseEntity.ok(paymentService.updatePaymentStatus(missionId));
    }

    // 3. Went_wrong
    @PutMapping("/{missionId}/error")
    public ResponseEntity<Payment> markAsError(@RequestHeader("Authorization") String authHeader,@PathVariable UUID missionId) {
        return ResponseEntity.ok(paymentService.wentWrong(missionId));
    }

    // 4. Refund_payment
    @PutMapping("/{missionId}/refund")
    public ResponseEntity<Payment> refund(@RequestHeader("Authorization") String authHeader,@PathVariable UUID missionId) {
        return ResponseEntity.ok(paymentService.refundPayment(missionId));
    }

    // 5. Get_payment_status
    @GetMapping("/{missionId}/status")
    public ResponseEntity<String> getStatus(@RequestHeader("Authorization") String authHeader,@PathVariable UUID missionId) {
        return ResponseEntity.ok(paymentService.getPaymentStatus(missionId));
    }

    @PostMapping("/{missionId}/intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(
            @PathVariable UUID missionId,
            @RequestHeader("Authorization") String authHeader
    ) throws StripeException {
        String clientSecret = paymentService.createStripePaymentIntent(missionId);
        return ResponseEntity.ok(Map.of("clientSecret", clientSecret));
    }

    @PostMapping("/classicPass")
    public Map<String, String> createClassicPayment(@RequestHeader("Authorization") String authHeader) {
        String clientSecret = stripeService.createPaymentIntent(classic_pass);
        return Map.of("clientSecret", clientSecret);
    }

    @PostMapping("/premiumPass")
    public Map<String, String> createPremiumPayment(@RequestHeader("Authorization") String authHeader) {
        String clientSecret = stripeService.createPaymentIntent(premium_pass);
        return Map.of("clientSecret", clientSecret);
    }

    @PostMapping("/pay_mission/{orderId}")
    public String createPayment(@RequestHeader("Authorization") String authHeader,
                                @PathVariable UUID orderId) {
        Order order = orderRepository.findByIdOrder(orderId)
                .orElseThrow(() -> new RuntimeException("Order non trouvé"));

        Mission mission = missionRepository.findByOrder(order)
                .orElseThrow(() -> new RuntimeException("Mission non trouvée"));

        Payment payment = paymentRepository.findByMission(mission)
                .orElseThrow(() -> new RuntimeException("Payment non trouvée"));

        if (payment.getAmount() == null) {
            throw new RuntimeException("Montant du paiement manquant");
        }

        PaymentIntentResponse intentResponse = stripeService.createPaymentIntent(payment.getAmount());

        // 🔒 On stocke l’ID Stripe
        payment.setStripeId(intentResponse.getId());
        payment.setStatus("CREATED");
        payment.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // 🔁 On retourne toujours juste le clientSecret (comme avant)
        return intentResponse.getClientSecret();
    }

    @PostMapping("/{missionId}/transfer")
    public ResponseEntity<String> payDeliverer(
            @PathVariable UUID missionId,
            @RequestHeader("Authorization") String authHeader) throws StripeException {

        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission non trouvée"));

        User deliverer = mission.getTraveler(); // à adapter selon ton modèle

        if (deliverer.getStripeAccountId() == null) {
            stripeService.createConnectedAccountForUser(deliverer);
        }

        Payment payment = paymentRepository.findByMission(mission)
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé"));

        if (!"SUCCEEDED".equals(payment.getStatus())) {
            throw new RuntimeException("Paiement non encore validé");
        }

        // 💰 Montant à transférer : montant total - commission (par ex 10%)
        long totalAmountCents = (long) (payment.getAmount() * 100);
        long platformFee = (long) (totalAmountCents * 0.10); // 10% de taxe
        long amountToSend = totalAmountCents - platformFee;

        try {
            stripeService.createTransferToUser(deliverer.getStripeAccountId(), amountToSend);
            return ResponseEntity.ok("Transfert effectué avec succès");
        } catch (StripeException e) {
            return ResponseEntity.status(500).body("Erreur Stripe : " + e.getMessage());
        }
    }


}
