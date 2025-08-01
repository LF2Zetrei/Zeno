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

/**
 * Service métier pour gérer les opérations liées aux paiements :
 * validation, remboursement, erreurs, récupération du statut
 * et intégration avec Stripe.
 */
@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final MissionRepository missionRepository;

    public PaymentService(PaymentRepository paymentRepository, MissionRepository missionRepository) {
        this.paymentRepository = paymentRepository;
        this.missionRepository = missionRepository;
    }

    /**
     * Met à jour le statut d'un paiement à "validé" pour une mission donnée.
     *
     * @param missionId L'identifiant unique de la mission concernée.
     * @return Le paiement mis à jour avec le nouveau statut.
     * @throws RuntimeException si la mission ou le paiement est introuvable.
     */
    public Payment updatePaymentStatus(UUID missionId) {
        Mission mission = missionRepository.findByIdMission(missionId)
                .orElseThrow(() -> new RuntimeException("Mission not found"));

        return paymentRepository.findByMission(mission).map(payment -> {
            payment.setStatus("validé");
            payment.setUpdatedAt(LocalDateTime.now());
            System.out.println("[updatePaymentStatus] où le payment:" + payment);
            return paymentRepository.save(payment);
        }).orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    /**
     * Marque un paiement comme "erreur" pour une mission donnée.
     *
     * @param missionId L'identifiant unique de la mission concernée.
     * @return Le paiement mis à jour avec le statut "erreur".
     * @throws RuntimeException si la mission ou le paiement est introuvable.
     */
    public Payment wentWrong(UUID missionId) {
        Mission mission = missionRepository.findByIdMission(missionId)
                .orElseThrow(() -> new RuntimeException("Mission not found"));

        return paymentRepository.findByMission(mission).map(payment -> {
            payment.setStatus("erreur");
            payment.setUpdatedAt(LocalDateTime.now());
            return paymentRepository.save(payment);
        }).orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    /**
     * Marque un paiement comme "remboursé" pour une mission donnée.
     *
     * @param missionId L'identifiant unique de la mission concernée.
     * @return Le paiement mis à jour avec le statut "remboursé".
     * @throws RuntimeException si la mission ou le paiement est introuvable.
     */
    public Payment refundPayment(UUID missionId) {
        Mission mission = missionRepository.findByIdMission(missionId)
                .orElseThrow(() -> new RuntimeException("Mission not found"));

        return paymentRepository.findByMission(mission).map(payment -> {
            payment.setStatus("remboursé");
            payment.setUpdatedAt(LocalDateTime.now());
            return paymentRepository.save(payment);
        }).orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    /**
     * Récupère le statut actuel du paiement associé à une mission.
     *
     * @param missionId L'identifiant unique de la mission concernée.
     * @return Le statut du paiement sous forme de chaîne.
     * @throws RuntimeException si la mission ou le paiement est introuvable.
     */
    public String getPaymentStatus(UUID missionId) {
        Mission mission = missionRepository.findByIdMission(missionId)
                .orElseThrow(() -> new RuntimeException("Mission not found"));

        return paymentRepository.findByMission(mission)
                .map(Payment::getStatus)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    /**
     * Crée une intention de paiement Stripe pour une mission donnée.
     *
     * @param missionId L'identifiant unique de la mission concernée.
     * @return Le clientSecret Stripe à utiliser côté client pour finaliser le paiement.
     * @throws StripeException si une erreur survient lors de l'appel à l'API Stripe.
     * @throws RuntimeException si la mission ou le paiement est introuvable.
     */
    public String createStripePaymentIntent(UUID missionId) throws StripeException {
        Mission mission = missionRepository.findByIdMission(missionId)
                .orElseThrow(() -> new RuntimeException("Mission not found"));

        Payment payment = paymentRepository.findByMission(mission)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        Stripe.apiKey = "sk_test_xxx"; // Remplacer par une configuration sécurisée (.env ou properties)

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount((long) (payment.getAmount() * 100)) // Convertit en centimes
                .setCurrency("eur")
                .build();

        PaymentIntent intent = PaymentIntent.create(params);
        payment.setStripeId(intent.getId());
        paymentRepository.save(payment);
        return intent.getClientSecret();
    }

}
