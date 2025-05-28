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


    // 2. Update_payment_status
    @PutMapping("/{paymentId}/validate")
    public ResponseEntity<Payment> updatePaymentStatus(@RequestHeader("Authorization") String authHeader,@PathVariable UUID paymentId) {
        return ResponseEntity.ok(paymentService.updatePaymentStatus(paymentId));
    }

    // 3. Went_wrong
    @PutMapping("/{paymentId}/error")
    public ResponseEntity<Payment> markAsError(@RequestHeader("Authorization") String authHeader,@PathVariable UUID paymentId) {
        return ResponseEntity.ok(paymentService.wentWrong(paymentId));
    }

    // 4. Refund_payment
    @PutMapping("/{paymentId}/refund")
    public ResponseEntity<Payment> refund(@RequestHeader("Authorization") String authHeader,@PathVariable UUID paymentId) {
        return ResponseEntity.ok(paymentService.refundPayment(paymentId));
    }

    // 5. Get_payment_status
    @GetMapping("/{paymentId}/status")
    public ResponseEntity<String> getStatus(@RequestHeader("Authorization") String authHeader,@PathVariable UUID paymentId) {
        return ResponseEntity.ok(paymentService.getPaymentStatus(paymentId));
    }
}
