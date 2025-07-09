package com.example.demo.payment;

import com.example.demo.mission.Mission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    Optional<Payment> findByMission(Mission mission);
    Boolean existsByStripeIdAndUserId(String stripeId, UUID userId);
}
