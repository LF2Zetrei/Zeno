package com.example.demo.stripe;

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

import java.util.UUID;

@Service
public class StripeService {

    @Value("${stripe.api.secret}")
    private String stripeSecretKey;

    private final UserRepository userRepository;

    public StripeService(UserRepository userRepository) {
        this.userRepository = userRepository;
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

    public String createPaymentIntent(Pass pass) {
        PaymentIntentResponse response = createPaymentIntent(pass.getPrice());
        return response.getClientSecret();
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
}
