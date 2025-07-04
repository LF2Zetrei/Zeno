package com.example.demo.stripe;

public class PaymentIntentResponse {
    private final String id;
    private final String clientSecret;

    public PaymentIntentResponse(String id, String clientSecret) {
        this.id = id;
        this.clientSecret = clientSecret;
    }

    public String getId() {
        return id;
    }

    public String getClientSecret() {
        return clientSecret;
    }
}
