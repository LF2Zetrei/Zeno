package com.example.demo.stripe;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.identity.VerificationSession;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.identity.VerificationSessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class StripeService {

    @Value("${stripe.api.secret}")
    private String stripeSecretKey;

    public String createPaymentIntent(double amount) {
        Stripe.apiKey = stripeSecretKey;

        PaymentIntentCreateParams params =
                PaymentIntentCreateParams.builder()
                        .setAmount((long) (amount * 100)) // montant en centimes
                        .setCurrency("eur")
                        .build();

        try {
            PaymentIntent intent = PaymentIntent.create(params);
            return intent.getClientSecret();
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
}
