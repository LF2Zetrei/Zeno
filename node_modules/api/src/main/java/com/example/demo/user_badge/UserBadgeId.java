package com.example.demo.user_badge;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public class UserBadgeId implements Serializable {

    private UUID user;
    private UUID badge;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        UserBadgeId that = (UserBadgeId) o;
        return Objects.equals(user, that.user) && Objects.equals(badge, that.badge);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, badge);
    }
}
