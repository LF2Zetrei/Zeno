package com.example.demo.stripe;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class PassInitializer {

    @Value("${pass.price.CLASSIC}")
    private double classicPrice;

    @Value("${pass.price.PREMIUM}")
    private double premiumPrice;

    @PostConstruct
    public void init() {
        Pass.CLASSIC.setPrice(classicPrice);
        Pass.PREMIUM.setPrice(premiumPrice);
    }
}

