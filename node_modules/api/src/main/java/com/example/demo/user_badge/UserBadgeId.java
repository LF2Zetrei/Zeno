package com.example.demo.user_badge;

import java.io.Serializable;
import java.util.UUID;

public class UserBadgeId implements Serializable {

    private UUID user;
    private UUID badge;

    // equals / hashCode nécessaires
}
