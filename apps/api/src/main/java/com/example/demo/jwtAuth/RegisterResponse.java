package com.example.demo.jwtAuth;

import java.util.UUID;

public class RegisterResponse {
    private UUID idUser;
    private String message;

    public RegisterResponse(UUID idUser, String message) {
        this.idUser = idUser;
        this.message = message;
    }

    public UUID getIdUser() {
        return idUser;
    }

    public String getMessage() {
        return message;
    }
}
