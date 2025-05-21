package com.example.demo.order;

import java.time.LocalDate;
import java.util.UUID;

public class OrderRequest {
    private String purchaseAddress;
    private String purchaseCountry;
    private LocalDate deadline;
    private UUID productId;
    private String artisanName;

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

    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
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
