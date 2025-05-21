package com.example.demo.order_product;

import java.io.Serializable;
import java.util.UUID;

public class OrderProductId implements Serializable {

    private UUID order;
    private UUID product;

    // equals / hashCode nécessaires
}
