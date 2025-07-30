package com.example.demo.stripe;

public enum Pass {
    CLASSIC,
    PREMIUM;

    private double price;

    public double getPrice() {
        return price;
    }

    // accessible uniquement par PassInitializer
    public void setPrice(double price) {
        this.price = price;
    }
}

