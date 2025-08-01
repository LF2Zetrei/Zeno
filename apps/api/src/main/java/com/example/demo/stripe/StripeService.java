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
import com.stripe.model.AccountLink;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Transfer;
import com.stripe.model.identity.VerificationSession;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.AccountLinkCreateParams;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.TransferCreateParams;
import com.stripe.param.identity.VerificationSessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class StripeService {
    @Value("${stripe.minimum.transfer.amount}")
    private float minimumTransferAmount;

    @Value("${stripe.company.taxe.amount}")
    private float companyTaxAmount;

    @Value("${stripe.api.secret}")
    private String stripeSecretKey;

    @Value("${stripe.return.url}")
    private String stripeReturnUrl;

    @Value("${stripe.refresh.url}")
    private String stripeRefreshUrl;

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

    /**
     * Crée une intention de paiement Stripe pour un montant donné.
     *
     * @param amount Montant en euros.
     * @return PaymentIntentResponse contenant l'ID de l'intention et le secret client.
     */
    public PaymentIntentResponse createPaymentIntent(double amount) {
        Stripe.apiKey = stripeSecretKey;

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount((long) (amount * 100))
                .setCurrency("eur")
                .build();

        try {
            PaymentIntent intent = PaymentIntent.create(params);
            return new PaymentIntentResponse(intent.getId(), intent.getClientSecret());
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la création du paiement Stripe", e);
        }
    }

    /**
     * Crée une session d'identité Stripe pour vérification du document d'identité.
     *
     * @param userId ID de l'utilisateur concerné.
     * @return URL de la session d'identité Stripe.
     * @throws StripeException en cas d'erreur Stripe.
     */
    public String createIdentitySession(UUID userId) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        VerificationSessionCreateParams params = VerificationSessionCreateParams.builder()
                .setType(VerificationSessionCreateParams.Type.DOCUMENT)
                .putMetadata("userId", userId.toString())
                .setReturnUrl(stripeReturnUrl)
                .build();

        VerificationSession session = VerificationSession.create(params);
        return session.getUrl();
    }

    /**
     * Transfère une somme en centimes vers un compte connecté Stripe.
     *
     * @param connectedAccountId ID du compte connecté Stripe.
     * @param amountInCents Montant à transférer en centimes.
     * @return Objet Transfer de Stripe.
     * @throws StripeException en cas d'erreur Stripe.
     */
    public Transfer createTransferToUser(String connectedAccountId, long amountInCents) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        TransferCreateParams params = TransferCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("eur")
                .setDestination(connectedAccountId)
                .build();

        return Transfer.create(params);
    }

    /**
     * Crée un compte Stripe pour un utilisateur s'il n'existe pas déjà.
     *
     * @param user Utilisateur concerné.
     * @return Message de confirmation avec l'ID du compte Stripe.
     * @throws StripeException en cas d'erreur Stripe.
     */
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

    /**
     * Crée une intention de paiement Stripe liée à une mission.
     *
     * @param orderId ID de la commande.
     * @return Secret client de l'intention de paiement.
     */
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

    /**
     * Effectue un transfert d'argent vers le livreur d'une mission.
     *
     * @param missionId ID de la mission.
     * @throws StripeException en cas d'erreur Stripe.
     */
    public void transferToDeliverer(UUID missionId) throws StripeException {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission non trouvée"));

        User deliverer = mission.getTraveler();
        Payment payment = paymentRepository.findByMission(mission)
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé"));

        if (!"SUCCEEDED".equals(payment.getStatus())) {
            throw new RuntimeException("Paiement non encore validé");
        }

        Float amount = payment.getAmount();
        if (amount <= minimumTransferAmount) {
            amount = minimumTransferAmount;
        }

        long totalAmountCents = (long) (amount * 100);
        long platformFee = (long) (totalAmountCents * 0.10);
        long amountToSend = totalAmountCents - platformFee;

        createTransferToUser(deliverer.getStripeAccountId(), amountToSend);
    }

    /**
     * Sauvegarde un paiement en attente dans la base de données.
     *
     * @param paymentIntentId ID de l'intention de paiement.
     * @param userId ID de l'utilisateur.
     * @param type Statut du paiement (ex : CREATED).
     */
    public void savePendingPayment(String paymentIntentId, UUID userId, String type) {
        Payment pending = new Payment();
        pending.setUserId(userId);
        pending.setStripeId(paymentIntentId);
        pending.setStatus(type);
        paymentRepository.save(pending);
    }

    /**
     * Vérifie si une intention de paiement est associée à un utilisateur.
     *
     * @param paymentIntentId ID de l'intention.
     * @param userId ID de l'utilisateur.
     * @return true si l'intention est liée, false sinon.
     */
    public boolean isPaymentIntentLinkedToUser(String paymentIntentId, UUID userId) {
        return paymentRepository.existsByStripeIdAndUserId(paymentIntentId, userId);
    }

    /**
     * Crée une intention de paiement pour une mission avec un retour complet (ID + secret).
     *
     * @param orderId ID de la commande.
     * @return PaymentIntentResponse contenant les informations Stripe.
     */
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

        PaymentIntentResponse intentResponse = createPaymentIntent(payment.getAmount() + companyTaxAmount);

        payment.setStripeId(intentResponse.getId());
        payment.setStatus("CREATED");
        payment.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        return intentResponse;
    }

    /**
     * Crée un nouveau compte Stripe EXPRESS pour un utilisateur.
     *
     * @param user Utilisateur concerné.
     * @return ID du compte Stripe.
     * @throws StripeException en cas d'erreur Stripe.
     */
    public String createStripeAccount(User user) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        AccountCreateParams params = AccountCreateParams.builder()
                .setType(AccountCreateParams.Type.EXPRESS)
                .setEmail(user.getEmail())
                .build();

        Account account = Account.create(params);

        return account.getId();
    }

    /**
     * Crée un lien d'onboarding pour finaliser la configuration du compte Stripe.
     *
     * @param accountId ID du compte Stripe.
     * @return URL d'onboarding Stripe.
     * @throws StripeException en cas d'erreur Stripe.
     */
    public String createAccountLink(String accountId) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        AccountLinkCreateParams params = AccountLinkCreateParams.builder()
                .setAccount(accountId)
                .setRefreshUrl(stripeRefreshUrl)
                .setReturnUrl(stripeReturnUrl)
                .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
                .build();

        AccountLink accountLink = AccountLink.create(params);
        return accountLink.getUrl();
    }
}
