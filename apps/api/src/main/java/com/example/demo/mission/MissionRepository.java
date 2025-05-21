package com.example.demo.mission;

import com.example.demo.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MissionRepository extends JpaRepository<Mission, UUID> {
    List<Mission> findByTraveler(User traveler);
    Optional<Mission> findByOrder_IdOrder(UUID orderId);
}
