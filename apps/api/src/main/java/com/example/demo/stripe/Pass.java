package com.example.demo.stripe;

public enum Pass {
    CLASSIC(5.99),
    PREMIUM(9.99);

    private final double price;

    Pass(double price) {
        this.price = price;
    }

    public double getPrice() {
        return price;
    }
}

