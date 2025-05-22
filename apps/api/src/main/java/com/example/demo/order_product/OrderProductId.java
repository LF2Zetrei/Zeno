package com.example.demo.order_product;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public class OrderProductId implements Serializable {

    private UUID order;
    private UUID product;

    public OrderProductId() {}

    public OrderProductId(UUID order, UUID product) {
        this.order = order;
        this.product = product;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderProductId that = (OrderProductId) o;
        return Objects.equals(order, that.order) && Objects.equals(product, that.product);
    }

    @Override
    public int hashCode() {
        return Objects.hash(order, product);
    }
}
