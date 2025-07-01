package com.example.demo.payment;

import com.example.demo.mission.Mission;
import com.example.demo.mission.MissionRepository;
import com.stripe.exception.StripeException;
import org.springframework.stereotype.Service;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

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

    // 2. Update_payment_status
    public Payment updatePaymentStatus(UUID missionId) {
        Mission mission = missionRepository.findByIdMission(missionId).orElseThrow(() -> new RuntimeException("Mission not found"));
        return paymentRepository.findByMission(mission).map(payment -> {
            payment.setStatus("validé");
            payment.setUpdatedAt(LocalDateTime.now());
            System.out.println("[updatePaymentStatus] où le payment:" + payment );
            return paymentRepository.save(payment);
        }).orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    // 3. Went_wrong
    public Payment wentWrong(UUID missionId) {
        Mission mission = missionRepository.findByIdMission(missionId).orElseThrow(() -> new RuntimeException("Mission not found"));
        return paymentRepository.findByMission(mission).map(payment -> {
            payment.setStatus("erreur");
            payment.setUpdatedAt(LocalDateTime.now());
            return paymentRepository.save(payment);
        }).orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    // 4. Refund_payment
    public Payment refundPayment(UUID missionId) {
        Mission mission = missionRepository.findByIdMission(missionId).orElseThrow(() -> new RuntimeException("Mission not found"));
        return paymentRepository.findByMission(mission).map(payment -> {
            payment.setStatus("remboursé");
            payment.setUpdatedAt(LocalDateTime.now());
            return paymentRepository.save(payment);
        }).orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    // 5. Get_payment_status
    public String getPaymentStatus(UUID missionId) {
        Mission mission = missionRepository.findByIdMission(missionId).orElseThrow(() -> new RuntimeException("Mission not found"));
        return paymentRepository.findByMission(mission)
                .map(Payment::getStatus)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    public String createStripePaymentIntent(UUID missionId) throws StripeException {
        Mission mission = missionRepository.findByIdMission(missionId)
                .orElseThrow(() -> new RuntimeException("Mission not found"));
        Payment payment = paymentRepository.findByMission(mission)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        Stripe.apiKey = "sk_test_xxx"; // ou injecte via .env ou application.properties

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount((long) (payment.getAmount() * 100)) // en centimes
                .setCurrency("eur")
                .build();

        PaymentIntent intent = PaymentIntent.create(params);
        payment.setStripeId(intent.getId());
        paymentRepository.save(payment);
        return intent.getClientSecret();
    }

}

