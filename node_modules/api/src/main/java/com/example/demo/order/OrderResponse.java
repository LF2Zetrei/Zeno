package com.example.demo.order;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class OrderResponse {
    private UUID idOrder;
    private String purchaseAddress;
    private String purchaseCountry;
    private LocalDate deadline;
    private Float priceEstimation;
    private String artisanName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}