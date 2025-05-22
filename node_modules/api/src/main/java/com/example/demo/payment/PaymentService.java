package com.example.demo.payment;

import com.example.demo.mission.Mission;
import com.example.demo.mission.MissionRepository;
import com.example.demo.order.Order;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final MissionRepository missionRepository; // pour chercher la mission

    public PaymentService(PaymentRepository paymentRepository, MissionRepository missionRepository) {
        this.paymentRepository = paymentRepository;
        this.missionRepository = missionRepository;
    }

    // 1. Create_payment
    public Payment createPayment(String stripeId, UUID missionId) {
        Mission mission = missionRepository.findByIdMission(missionId)
                .orElseThrow(() -> new RuntimeException("Mission not found"));

        Order order = mission.getOrder();
        if (order == null || order.getPriceEstimation() == null) {
            throw new RuntimeException("Order or amount not found");
        }

        Payment payment = new Payment();
        payment.setIdPayment(UUID.randomUUID());
        payment.setStripeId(stripeId);
        payment.setMission(mission);
        payment.setStatus("en attente");
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        payment.setAmount(order.getPriceEstimation());

        return paymentRepository.save(payment);
    }

    // 2. Update_payment_status
    public Payment updatePaymentStatus(UUID paymentId) {
        return paymentRepository.findById(paymentId).map(payment -> {
            payment.setStatus("validé");
            payment.setUpdatedAt(LocalDateTime.now());
            return paymentRepository.save(payment);
        }).orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    // 3. Went_wrong
    public Payment wentWrong(UUID paymentId) {
        return paymentRepository.findById(paymentId).map(payment -> {
            payment.setStatus("erreur");
            payment.setUpdatedAt(LocalDateTime.now());
            return paymentRepository.save(payment);
        }).orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    // 4. Refund_payment
    public Payment refundPayment(UUID paymentId) {
        return paymentRepository.findById(paymentId).map(payment -> {
            payment.setStatus("remboursé");
            payment.setUpdatedAt(LocalDateTime.now());
            return paymentRepository.save(payment);
        }).orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    // 5. Get_payment_status
    public String getPaymentStatus(UUID paymentId) {
        return paymentRepository.findById(paymentId)
                .map(Payment::getStatus)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
}

