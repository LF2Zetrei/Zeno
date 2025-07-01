package com.example.demo.payment;

import com.example.demo.mission.Mission;
import com.example.demo.mission.MissionRepository;
import com.example.demo.order.Order;
import com.example.demo.order.OrderRepository;
import com.example.demo.stripe.StripeService;
import com.stripe.exception.StripeException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    private final Double classic_pass = 17.99;
    private final Double premium_pass = 49.99;


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

    @PostMapping("/intent")
    public Map<String, String> createPaymentIntent(@RequestHeader("Authorization") String authHeader, @RequestParam double amount) {
        String clientSecret = stripeService.createPaymentIntent(amount);
        return Map.of("clientSecret", clientSecret);
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
    public Map<String, String> createPayment(@RequestHeader("Authorization") String authHeader, @PathVariable UUID orderId) {
        Order order = orderRepository.findByIdOrder(orderId).orElseThrow(() ->  new RuntimeException("Order non trouvé"));
        Mission mission = missionRepository.findByOrder(order).orElseThrow(() -> new RuntimeException("Mission non trouvée"));
        Payment payment = paymentRepository.findByMission(mission).orElseThrow(() -> new RuntimeException("Payment non trouvée"));
        String clientSecret = null;
        if (payment.getAmount() != null) {
            clientSecret = stripeService.createPaymentIntent(payment.getAmount());
        }
        return Map.of("clientSecret", clientSecret);
    }

}
