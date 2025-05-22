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

    public OrderProduct() {}

    public OrderProduct(Order order, Product product, Float priceAtOrder) {
        this.order = order;
        this.product = product;
        this.priceAtOrder = priceAtOrder;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Float getPriceAtOrder() {
        return priceAtOrder;
    }

    public void setPriceAtOrder(Float priceAtOrder) {
        this.priceAtOrder = priceAtOrder;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}

