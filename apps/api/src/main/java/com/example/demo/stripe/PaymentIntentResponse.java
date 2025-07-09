package com.example.demo.stripe;

// Ce DTO est correct
public class PaymentIntentResponse {
    private String id;
    private String clientSecret;

    // Constructeur
    public PaymentIntentResponse(String id, String clientSecret) {
        this.id = id;
        this.clientSecret = clientSecret;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getClientSecret() {
        return clientSecret;
    }
}

