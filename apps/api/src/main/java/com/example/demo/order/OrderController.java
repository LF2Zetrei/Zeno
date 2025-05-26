package com.example.demo.order;

import com.example.demo.user.User;
import com.example.demo.user.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLOutput;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<OrderResponse> createOrder(@RequestHeader("Authorization") String authHeader,
                                             @RequestBody OrderRequest request) {
        User user = userService.getUserByJwt(authHeader);
        OrderResponse order = orderService.createOrder(request, user);
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

    @PostMapping("/{orderId}/product/{productId}")
    public ResponseEntity<Void> addProductToOrder(@PathVariable UUID orderId,
                                                  @PathVariable UUID productId,
                                                  @RequestHeader("Authorization") String authHeader) {
        String jwt = extractToken(authHeader);
        orderService.addProductToOrder(productId, orderId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{orderId}/product/{productId}")
    public ResponseEntity<Void> deleteProductInOrder(@PathVariable UUID orderId,
                                                     @PathVariable UUID productId,
                                                     @RequestHeader("Authorization") String authHeader) {
        String jwt = extractToken(authHeader);
        orderService.deleteProductInOrder(orderId, productId);
        return ResponseEntity.noContent().build();
    }
}

