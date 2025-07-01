package com.example.demo.stripe;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

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
}
