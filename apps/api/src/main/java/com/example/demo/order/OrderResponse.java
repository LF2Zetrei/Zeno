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
    private String city;
    private Float latitude;
    private Float longitude;

    // Getters & Setters

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Float getLatitude() {
        return latitude;
    }

    public void setLatitude(Float latitude) {
        this.latitude = latitude;
    }

    public Float getLongitude() {
        return longitude;
    }

    public void setLongitude(Float longitude) {
        this.longitude = longitude;
    }

    public UUID getIdOrder() {
        return idOrder;
    }

    public void setIdOrder(UUID idOrder) {
        this.idOrder = idOrder;
    }

    public String getPurchaseAddress() {
        return purchaseAddress;
    }

    public void setPurchaseAddress(String purchaseAddress) {
        this.purchaseAddress = purchaseAddress;
    }

    public String getPurchaseCountry() {
        return purchaseCountry;
    }

    public void setPurchaseCountry(String purchaseCountry) {
        this.purchaseCountry = purchaseCountry;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public Float getPriceEstimation() {
        return priceEstimation;
    }

    public void setPriceEstimation(Float priceEstimation) {
        this.priceEstimation = priceEstimation;
    }

    public String getArtisanName() {
        return artisanName;
    }

    public void setArtisanName(String artisanName) {
        this.artisanName = artisanName;
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

    // 💡 Méthode statique pour builder
    public static Builder builder() {
        return new Builder();
    }

    // ✅ Classe Builder manuelle
    public static class Builder {
        private UUID idOrder;
        private String purchaseAddress;
        private String purchaseCountry;
        private LocalDate deadline;
        private Float priceEstimation;
        private String artisanName;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private String city;
        private Float latitude;
        private Float longitude;
        public Builder idOrder(UUID idOrder) {
            this.idOrder = idOrder;
            return this;
        }

        public Builder city(String city) {
            this.city = city;
            return this;
        }

        public Builder latitude(Float latitude) {
            this.latitude = latitude;
            return this;
        }

        public Builder longitude(Float longitude) {
            this.longitude = longitude;
return this; }

        public Builder purchaseAddress(String purchaseAddress) {
            this.purchaseAddress = purchaseAddress;
            return this;
        }

        public Builder purchaseCountry(String purchaseCountry) {
            this.purchaseCountry = purchaseCountry;
            return this;
        }

        public Builder deadline(LocalDate deadline) {
            this.deadline = deadline;
            return this;
        }

        public Builder priceEstimation(Float priceEstimation) {
            this.priceEstimation = priceEstimation;
            return this;
        }

        public Builder artisanName(String artisanName) {
            this.artisanName = artisanName;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public OrderResponse build() {
            OrderResponse response = new OrderResponse();
            response.setIdOrder(this.idOrder);
            response.setPurchaseAddress(this.purchaseAddress);
            response.setPurchaseCountry(this.purchaseCountry);
            response.setDeadline(this.deadline);
            response.setPriceEstimation(this.priceEstimation);
            response.setArtisanName(this.artisanName);
            response.setCreatedAt(this.createdAt);
            response.setUpdatedAt(this.updatedAt);
            response.setCity(this.city);
            response.setLatitude(this.latitude);
            response.setLongitude(this.longitude);
       return response;
        }
    }
}
