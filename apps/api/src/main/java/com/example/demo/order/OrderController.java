package com.example.demo.order;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody @Valid OrderRequest request,
                                             @RequestHeader("Authorization") String authHeader) {
        String jwt = extractToken(authHeader);
        Order order = orderService.createOrder(request, jwt);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<Order> updateOrder(@PathVariable UUID orderId,
                                             @RequestBody @Valid OrderRequest request,
                                             @RequestHeader("Authorization") String authHeader) {
        String jwt = extractToken(authHeader);
        Order updated = orderService.updateOrder(orderId, request, jwt);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> cancelOrder(@PathVariable UUID orderId,
                                            @RequestHeader("Authorization") String authHeader) {
        String jwt = extractToken(authHeader);
        orderService.cancelOrder(orderId, jwt);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders(@RequestHeader("Authorization") String authHeader) {
        String jwt = extractToken(authHeader);
        return ResponseEntity.ok(orderService.getMyOrders(jwt));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable UUID orderId,
                                              @RequestHeader("Authorization") String authHeader) {
        String jwt = extractToken(authHeader);
        return ResponseEntity.ok(orderService.getOrderById(orderId, jwt));
    }

    // Petite méthode utilitaire pour extraire le token depuis "Bearer ..."
    private String extractToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        throw new RuntimeException("Token manquant ou invalide");
    }
}

