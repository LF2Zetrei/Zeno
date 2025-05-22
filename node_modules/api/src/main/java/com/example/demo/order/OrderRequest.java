package com.example.demo.order;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class OrderRequest {
        private String purchaseAddress;
        private String purchaseCountry;
        private LocalDate deadline;
        private String artisanName;

        // ✅ Assure-toi d’avoir une liste ici
        private List<UUID> productIds;

        public List<UUID> getProductIds() {
            return productIds;
        }

        public void setProductIds(List<UUID> productIds) {
            this.productIds = productIds;
        }

    public String getArtisanName() {
        return artisanName;
    }

    public void setArtisanName(String artisanName) {
        this.artisanName = artisanName;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
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
}
