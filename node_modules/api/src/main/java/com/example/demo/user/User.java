package com.example.demo.user;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "\"user\"")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id_user", nullable = false, unique = true, updatable = false)
    private UUID idUser;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "pseudo", unique = true)
    private String pseudo;

    @Column(name = "email", unique = true, nullable = false)
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

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "number_of_ratings")
    private Integer numberOfRatings = 0;

    @Column(name="longitude")
    private Double longitude;

    @Column(name="latitude")
    private Double latitude;

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getAddress() {
        return address;
    }

    public Integer getNumberOfRatings() {
        return numberOfRatings;
    }

    public void setNumberOfRatings(Integer numberOfRatings) {
        this.numberOfRatings = numberOfRatings;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public boolean isBasicSubscription() {
        return basicSubscription;
    }

    public void setBasicSubscription(boolean basicSubscription) {
        this.basicSubscription = basicSubscription;
    }

    public LocalDateTime getBasicSubscriptionSince() {
        return basicSubscriptionSince;
    }

    public void setBasicSubscriptionSince(LocalDateTime basicSubscriptionSince) {
        this.basicSubscriptionSince = basicSubscriptionSince;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDate getDeliverSince() {
        return deliverSince;
    }

    public void setDeliverSince(LocalDate deliverSince) {
        this.deliverSince = deliverSince;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getIdentityCardUrl() {
        return identityCardUrl;
    }

    public void setIdentityCardUrl(String identityCardUrl) {
        this.identityCardUrl = identityCardUrl;
    }

    public UUID getIdUser() {
        return idUser;
    }

    public void setIdUser(UUID idUser) {
        this.idUser = idUser;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public boolean isPremiumSubscription() {
        return premiumSubscription;
    }

    public void setPremiumSubscription(boolean premiumSubscription) {
        this.premiumSubscription = premiumSubscription;
    }

    public LocalDateTime getPremiumSubscriptionSince() {
        return premiumSubscriptionSince;
    }

    public void setPremiumSubscriptionSince(LocalDateTime premiumSubscriptionSince) {
        this.premiumSubscriptionSince = premiumSubscriptionSince;
    }

    public String getPseudo() {
        return pseudo;
    }

    public void setPseudo(String pseudo) {
        this.pseudo = pseudo;
    }

    public BigDecimal getRatingAverage() {
        return ratingAverage;
    }

    public void setRatingAverage(BigDecimal ratingAverage) {
        this.ratingAverage = ratingAverage;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public User() {}

    public User(UUID idUser, String email, String password) {
        this.idUser = idUser;
        this.email = email;
        this.password = password;
    }

    @Override
    public String toString() {
        return "User{" +
                "idUser=" + idUser +
                ", email='" + email + '\'' +
                ", pseudo='" + pseudo + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}
