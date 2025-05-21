package com.example.demo.message;

import com.example.demo.user.User;
import jakarta.persistence.*;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "message")
public class Message {

    @Id
    @Column(name = "id_message", nullable = false, unique = true)
    private UUID idMessage;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    private String content;

    @Column(name = "sent_since")
    private ZonedDateTime sentSince;

    // Getters, setters, constructors omis
}
