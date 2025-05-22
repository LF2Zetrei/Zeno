package com.example.demo.order_product;

import com.example.demo.order.Order;
import com.example.demo.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderProductRepository extends JpaRepository<OrderProduct, OrderProductId> {
    Optional<OrderProduct> findByOrderAndProduct(Order order, Product product);

    boolean existsByOrderAndProduct(Order order, Product product);
}
