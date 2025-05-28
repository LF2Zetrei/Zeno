package com.example.demo.order;

import com.example.demo.order_product.OrderProduct;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.example.demo.user.User;

@Entity
@Table(name = "\"order\"")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Order {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "id_order", nullable = false)
    private UUID idOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @Column(name = "purchase_address")
    private String purchaseAddress;

    @Column(name = "purchase_country")
    private String purchaseCountry;

    private LocalDate deadline;

    @Column(name = "price_estimation")
    private Float priceEstimation;

    @Column(name = "artisan_name")
    private String artisanName;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "status")
    private String status;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderProduct> orderProducts = new ArrayList<>();

    // getter et setter pour orderProducts

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<OrderProduct> getOrderProducts() {
        return orderProducts;
    }

    public void setOrderProducts(List<OrderProduct> orderProducts) {
        this.orderProducts = orderProducts;
    }

    public Order() {
    }

    public Order(UUID idOrder, User buyer, String purchaseAddress, String purchaseCountry,
                 LocalDate deadline, Float priceEstimation, String artisanName,
                 LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.idOrder = idOrder;
        this.buyer = buyer;
        this.purchaseAddress = purchaseAddress;
        this.purchaseCountry = purchaseCountry;
        this.deadline = deadline;
        this.priceEstimation = priceEstimation;
        this.artisanName = artisanName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getIdOrder() {
        return idOrder;
    }

    public void setIdOrder(UUID idOrder) {
        this.idOrder = idOrder;
    }

    public User getBuyer() {
        return buyer;
    }

    public void setBuyer(User buyer) {
        this.buyer = buyer;
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
}