package com.example.demo.order;

import com.example.demo.mission.MissionResponse;
import com.example.demo.product.Product;
import com.example.demo.user.User;
import com.example.demo.user.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<?> createOrder(@RequestHeader("Authorization") String authHeader,
                                         @RequestBody OrderRequest request) {
        try {
            User user = userService.getUserByJwt(authHeader);
            OrderResponse order = orderService.createOrder(request, user);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            // tu peux logger l'erreur ici si besoin
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur lors de la création de la commande : " + e.getMessage());
        }
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateStatus(@RequestHeader("Authorization") String authHeader, @PathVariable UUID orderId,
                                                        @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    @GetMapping("/{orderId}/status")
    public ResponseEntity<String> getStatus(@RequestHeader("Authorization") String authHeader,@PathVariable UUID orderId) {
        return ResponseEntity.ok(orderService.getOrderStatus(orderId));
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

    @PutMapping("/{orderId}/public")
    public ResponseEntity<Void> validateOrder(@PathVariable UUID orderId, @RequestHeader("Authorization") String authHeader){
        String jwt = extractToken(authHeader);
        orderService.validateOrder(orderId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("{orderId}/products")
    public ResponseEntity<List<Product>> getProductsInOrder(@PathVariable UUID orderId, @RequestHeader("Authorization") String authHeader){
        String jwt = extractToken(authHeader);
        return ResponseEntity.ok(orderService.getProductsInOrder(orderId));
    }
}

