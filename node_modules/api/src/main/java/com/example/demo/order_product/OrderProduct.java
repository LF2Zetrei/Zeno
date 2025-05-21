package com.example.demo.order_product;

import com.example.demo.order.Order;
import com.example.demo.product.Product;
import jakarta.persistence.*;


@Entity
@Table(name = "order_product")
@IdClass(OrderProductId.class)
public class OrderProduct {

    @Id
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @Id
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "price_at_order")
    private Float priceAtOrder;

    // Getters, setters, constructeurs omis
}

