package com.example.demo.payment;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // 1. Create_payment
    @PostMapping("/create")
    public ResponseEntity<Payment> createPayment(@RequestParam String stripeId, @RequestParam UUID missionId) {
        return ResponseEntity.ok(paymentService.createPayment(stripeId, missionId));
    }

    // 2. Update_payment_status
    @PutMapping("/{paymentId}/validate")
    public ResponseEntity<Payment> updatePaymentStatus(@PathVariable UUID paymentId) {
        return ResponseEntity.ok(paymentService.updatePaymentStatus(paymentId));
    }

    // 3. Went_wrong
    @PutMapping("/{paymentId}/error")
    public ResponseEntity<Payment> markAsError(@PathVariable UUID paymentId) {
        return ResponseEntity.ok(paymentService.wentWrong(paymentId));
    }

    // 4. Refund_payment
    @PutMapping("/{paymentId}/refund")
    public ResponseEntity<Payment> refund(@PathVariable UUID paymentId) {
        return ResponseEntity.ok(paymentService.refundPayment(paymentId));
    }

    // 5. Get_payment_status
    @GetMapping("/{paymentId}/status")
    public ResponseEntity<String> getStatus(@PathVariable UUID paymentId) {
        return ResponseEntity.ok(paymentService.getPaymentStatus(paymentId));
    }
}
