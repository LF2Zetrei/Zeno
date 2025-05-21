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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public UUID getIdMessage() {
        return idMessage;
    }

    public void setIdMessage(UUID idMessage) {
        this.idMessage = idMessage;
    }

    public User getRecipient() {
        return recipient;
    }

    public void setRecipient(User recipient) {
        this.recipient = recipient;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public ZonedDateTime getSentSince() {
        return sentSince;
    }

    public void setSentSince(ZonedDateTime sentSince) {
        this.sentSince = sentSince;
    }
}
