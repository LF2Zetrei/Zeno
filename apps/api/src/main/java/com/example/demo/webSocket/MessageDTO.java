package com.example.demo.webSocket;

import java.util.UUID;

public class MessageDTO {
    private String content;
    private UUID recipientUsername;

    public UUID getRecipientUsername() {
        return recipientUsername;
    }

    public void setRecipientUsername(UUID recipientUsername) {
        this.recipientUsername = recipientUsername;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
