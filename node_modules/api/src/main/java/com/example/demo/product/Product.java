package com.example.demo.product;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @UuidGenerator
    @Column(name = "id_product", nullable = false)
    private UUID idProduct;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "photo_url")
    private String photoUrl;

    private Float weight;

    private Integer quantity;

    @Column(name = "estimated_price")
    private Float estimatedPrice;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
