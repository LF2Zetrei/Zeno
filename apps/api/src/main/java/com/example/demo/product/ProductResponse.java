package com.example.demo.product;

import java.time.LocalDateTime;
import java.util.UUID;

public class ProductResponse {
    private UUID idProduct;
    private String name;
    private String description;
    private String photoUrl;
    private Float weight;
    private Integer quantity;
    private Float estimatedPrice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters & Setters
    public UUID getIdProduct() {
        return idProduct;
    }

    public void setIdProduct(UUID idProduct) {
        this.idProduct = idProduct;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public Float getWeight() {
        return weight;
    }

    public void setWeight(Float weight) {
        this.weight = weight;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Float getEstimatedPrice() {
        return estimatedPrice;
    }

    public void setEstimatedPrice(Float estimatedPrice) {
        this.estimatedPrice = estimatedPrice;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
