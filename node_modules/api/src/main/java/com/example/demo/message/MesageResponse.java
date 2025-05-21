package com.example.demo.message;

import java.time.ZonedDateTime;
import java.util.UUID;

public class MesageResponse {
    private UUID id;
    private String senderPseudo;
    private String recipientPseudo;
    private String content;
    private ZonedDateTime sentSince;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getRecipientPseudo() {
        return recipientPseudo;
    }

    public void setRecipientPseudo(String recipientPseudo) {
        this.recipientPseudo = recipientPseudo;
    }

    public String getSenderPseudo() {
        return senderPseudo;
    }

    public void setSenderPseudo(String senderPseudo) {
        this.senderPseudo = senderPseudo;
    }

    public ZonedDateTime getSentSince() {
        return sentSince;
    }

    public void setSentSince(ZonedDateTime sentSince) {
        this.sentSince = sentSince;
    }
}
