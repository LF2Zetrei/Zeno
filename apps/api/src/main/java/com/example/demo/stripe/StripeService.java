package com.example.demo.stripe;

import com.example.demo.mission.Mission;
import com.example.demo.mission.MissionRepository;
import com.example.demo.order.Order;
import com.example.demo.order.OrderRepository;
import com.example.demo.payment.Payment;
import com.example.demo.payment.PaymentRepository;
import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Transfer;
import com.stripe.model.identity.VerificationSession;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.TransferCreateParams;
import com.stripe.param.identity.VerificationSessionCreateParams;
import org.antlr.v4.runtime.misc.LogManager;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class StripeService {

    @Value("${stripe.api.secret}")
    private String stripeSecretKey;

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final MissionRepository missionRepository;
    private final PaymentRepository paymentRepository;

    public StripeService(UserRepository userRepository,
                         OrderRepository orderRepository,
                         MissionRepository missionRepository,
                         PaymentRepository paymentRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.missionRepository = missionRepository;
        this.paymentRepository = paymentRepository;
    }

    public record StripePaymentIntent(String clientSecret, String intentId) {}

    public String createConnectedAccountForUser(User user) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        AccountCreateParams params = AccountCreateParams.builder()
                .setType(AccountCreateParams.Type.EXPRESS)
                .setEmail(user.getEmail())
                .build();

        Account account = Account.create(params);

        // Sauvegarde l'ID dans l'utilisateur
        user.setStripeAccountId(account.getId());
        userRepository.save(user);

        return account.getId();
    }

    public PaymentIntentResponse createPaymentIntent(double amount) {
        Stripe.apiKey = stripeSecretKey;

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount((long) (amount * 100))  // Stripe attend des centimes
                .setCurrency("eur")
                .build();

        try {
            PaymentIntent intent = PaymentIntent.create(params);
            return new PaymentIntentResponse(intent.getId(), intent.getClientSecret());
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la création du paiement Stripe", e);
        }
    }



    public String createIdentitySession(UUID userId) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        VerificationSessionCreateParams params = VerificationSessionCreateParams.builder()
                .setType(VerificationSessionCreateParams.Type.DOCUMENT)
                .putMetadata("userId", userId.toString())
                .setReturnUrl("http://localhost:3000/verify-complete")
                .build();

        VerificationSession session = VerificationSession.create(params);
        return session.getUrl();
    }

    public Transfer createTransferToUser(String connectedAccountId, long amountInCents) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        TransferCreateParams params = TransferCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("eur")
                .setDestination(connectedAccountId)
                .build();

        return Transfer.create(params);
    }

    public String handleStripeAccountCreation(User user) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        if (user.getStripeAccountId() != null) {
            return "Compte Stripe déjà créé : " + user.getStripeAccountId();
        }

        AccountCreateParams params = AccountCreateParams.builder()
                .setType(AccountCreateParams.Type.EXPRESS)
                .setEmail(user.getEmail())
                .build();

        Account account = Account.create(params);

        user.setStripeAccountId(account.getId());
        userRepository.save(user);

        return "Compte Stripe connecté créé : " + account.getId();
    }

    public String createMissionPaymentIntent(UUID orderId) {
        Order order = orderRepository.findByIdOrder(orderId)
                .orElseThrow(() -> new RuntimeException("Order non trouvé"));

        Mission mission = missionRepository.findByOrder(order)
                .orElseThrow(() -> new RuntimeException("Mission non trouvée"));

        Payment payment = paymentRepository.findByMission(mission)
                .orElseThrow(() -> new RuntimeException("Payment non trouvée"));

        if (payment.getAmount() == null) {
            throw new RuntimeException("Montant du paiement manquant");
        }

        PaymentIntentResponse intentResponse = createPaymentIntent(payment.getAmount());

        payment.setStripeId(intentResponse.getId());
        payment.setStatus("CREATED");
        payment.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        return intentResponse.getClientSecret();
    }

    public void transferToDeliverer(UUID missionId) throws StripeException {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission non trouvée"));

        User deliverer = mission.getTraveler();
        if (deliverer.getStripeAccountId() == null) {
            createConnectedAccountForUser(deliverer);
        }

        Payment payment = paymentRepository.findByMission(mission)
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé"));

        if (!"SUCCEEDED".equals(payment.getStatus())) {
            throw new RuntimeException("Paiement non encore validé");
        }

        long totalAmountCents = (long) (payment.getAmount() * 100);
        long platformFee = (long) (totalAmountCents * 0.10);
        long amountToSend = totalAmountCents - platformFee;

        createTransferToUser(deliverer.getStripeAccountId(), amountToSend);
    }

    public void savePendingPayment(String paymentIntentId, UUID userId, String type) {
        Payment pending = new Payment();
        pending.setUserId(userId);
        pending.setStripeId(paymentIntentId);
        pending.setStatus(type);
        paymentRepository.save(pending);
    }

    public boolean isPaymentIntentLinkedToUser(String paymentIntentId, UUID userId) {
        return paymentRepository.existsByStripeIdAndUserId(paymentIntentId, userId);
    }

    public PaymentIntentResponse createMissionPaymentIntentWithResponse(UUID orderId) {
        Order order = orderRepository.findByIdOrder(orderId)
                .orElseThrow(() -> new RuntimeException("Order non trouvé"));

        Mission mission = missionRepository.findByOrder(order)
                .orElseThrow(() -> new RuntimeException("Mission non trouvée"));

        Payment payment = paymentRepository.findByMission(mission)
                .orElseThrow(() -> new RuntimeException("Payment non trouvée"));

        if (payment.getAmount() == null) {
            throw new RuntimeException("Montant du paiement manquant");
        }

        PaymentIntentResponse intentResponse = createPaymentIntent(payment.getAmount());

        payment.setStripeId(intentResponse.getId());
        payment.setStatus("CREATED");
        payment.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        return intentResponse; // retourne à la fois ID et clientSecret
    }
}
