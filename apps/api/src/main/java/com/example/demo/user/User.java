package com.example.demo.user;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user")
public class User {

    @Id
    @Column(name = "id_user", nullable = false, unique = true)
    private UUID idUser;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "pseudo", unique = true)
    private String pseudo;

    @Column(name = "email", unique = true)
    private String email;

    private String password;
    private String phone;
    private String country;
    private String address;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "identity_card_url")
    private String identityCardUrl;

    private String role;

    @Column(name = "rating_average")
    private BigDecimal ratingAverage;

    @Column(name = "deliver_since")
    private LocalDate deliverSince;

    @Column(name = "basic_subscription")
    private boolean basicSubscription;

    @Column(name = "basic_subscription_since")
    private LocalDateTime basicSubscriptionSince;

    @Column(name = "premium_subscription")
    private boolean premiumSubscription;

    @Column(name = "premium_subscription_since")
    private LocalDateTime premiumSubscriptionSince;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Getters, setters, constructors omis ici pour clarté
}
