package com.example.demo.badge;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BadgeRepository extends JpaRepository<Badge, UUID> {
}
