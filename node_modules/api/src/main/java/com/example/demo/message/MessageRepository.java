package com.example.demo.message;

import com.example.demo.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {

    List<Message> findBySenderAndRecipientOrRecipientAndSender(User sender1, User recipient1, User sender2, User recipient2);
    List<Message> findBySenderOrRecipient(User sender, User recipient);
    Optional<Message> findByIdMessage(UUID id);
}