package com.example.demo.order;

import com.example.demo.mission.Mission;
import com.example.demo.mission.MissionMapper;
import com.example.demo.mission.MissionResponse;
import com.example.demo.mission.MissionService;
import com.example.demo.product.Product;
import com.example.demo.product.ProductMapper;
import com.example.demo.product.ProductResponse;
import com.example.demo.stripe.StripeService;
import com.example.demo.user.User;
import com.example.demo.user.UserService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLOutput;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;
    private final OrderRepository orderRepository;
    private final MissionService missionService;
    private final StripeService stripeService;

    public OrderController(OrderService orderService, UserService userService, OrderRepository orderRepository, MissionService missionService, StripeService stripeService) {
        this.orderService = orderService;
        this.userService = userService;
        this.orderRepository = orderRepository;
        this.missionService = missionService;
        this.stripeService = stripeService;
    }

    /**
     * Crée une nouvelle commande pour l'utilisateur authentifié.
     * @param authHeader L'en-tête d'autorisation contenant le token JWT
     * @param request Les détails de la commande à créer
     * @return La réponse HTTP contenant la commande créée ou une erreur
     */
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

    /**
     * Met à jour le statut d'une commande donnée.
     * @param authHeader L'en-tête d'autorisation JWT
     * @param orderId L'ID de la commande à mettre à jour
     * @param status Le nouveau statut de la commande
     * @return La commande mise à jour
     */
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateStatus(@RequestHeader("Authorization") String authHeader,
                                                      @PathVariable UUID orderId,
                                                      @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    /**
     * Récupère le statut d'une commande.
     * @param authHeader L'en-tête d'autorisation JWT
     * @param orderId L'ID de la commande
     * @return Le statut de la commande
     */
    @GetMapping("/{orderId}/status")
    public ResponseEntity<String> getStatus(@RequestHeader("Authorization") String authHeader,
                                            @PathVariable UUID orderId) {
        return ResponseEntity.ok(orderService.getOrderStatus(orderId));
    }

    /**
     * Récupère la mission associée à une commande.
     * @param orderId L'ID de la commande
     * @param authHeader L'en-tête d'autorisation JWT
     * @return La mission au format DTO
     */
    @GetMapping("/{orderId}/mission")
    public ResponseEntity<MissionResponse> getMissionByOrderId(@PathVariable UUID orderId,
                                                               @RequestHeader("Authorization") String authHeader) {
        MissionResponse mission = MissionMapper.toDto(orderService.getMissionByOrderId(orderId));
        return ResponseEntity.ok(mission);
    }

    /**
     * Met à jour une commande.
     * @param orderId L'ID de la commande à mettre à jour
     * @param request Les nouvelles données de la commande
     * @param authHeader L'en-tête d'autorisation JWT
     * @return La commande mise à jour
     */
    @PutMapping("/{orderId}")
    public ResponseEntity<OrderResponse> updateOrder(@PathVariable UUID orderId,
                                                     @RequestBody @Valid OrderRequest request,
                                                     @RequestHeader("Authorization") String authHeader) {
        String jwt = extractToken(authHeader);
        OrderResponse updated = orderService.updateOrder(orderId, request, jwt);
        return ResponseEntity.ok(updated);
    }

    /**
     * Annule une commande.
     * @param orderId L'ID de la commande à annuler
     * @param authHeader L'en-tête d'autorisation JWT
     * @return Réponse HTTP sans contenu
     */
    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> cancelOrder(@PathVariable UUID orderId,
                                            @RequestHeader("Authorization") String authHeader) {
        String jwt = extractToken(authHeader);
        orderService.cancelOrder(orderId, jwt);
        return ResponseEntity.noContent().build();
    }

    /**
     * Récupère la liste des commandes de l'utilisateur connecté.
     * @param authHeader L'en-tête d'autorisation JWT
     * @return La liste des commandes
     */
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(@RequestHeader("Authorization") String authHeader) {
        String jwt = extractToken(authHeader);
        return ResponseEntity.ok(orderService.getMyOrders(jwt));
    }

    /**
     * Récupère toutes les commandes (sans filtrage).
     * @param authHeader L'en-tête d'autorisation JWT
     * @return La liste complète des commandes
     */
    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders(@RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    /**
     * Récupère une commande par son ID.
     * @param orderId L'ID de la commande
     * @param authHeader L'en-tête d'autorisation JWT
     * @return La commande au format DTO
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable UUID orderId,
                                                      @RequestHeader("Authorization") String authHeader) {
        String jwt = extractToken(authHeader);
        return ResponseEntity.ok(orderService.getOrderById(orderId, jwt));
    }

    /**
     * Extrait le token JWT de l'en-tête Authorization.
     * @param authHeader L'en-tête Authorization au format "Bearer token"
     * @return Le token JWT extrait
     * @throws RuntimeException si le token est manquant ou invalide
     */
    private String extractToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        throw new RuntimeException("Token manquant ou invalide");
    }

    /**
     * Ajoute un produit à une commande.
     * @param orderId L'ID de la commande
     * @param productId L'ID du produit à ajouter
     * @param authHeader L'en-tête d'autorisation JWT
     * @return Réponse HTTP OK
     */
    @PostMapping("/{orderId}/product/{productId}")
    public ResponseEntity<Void> addProductToOrder(@PathVariable UUID orderId,
                                                  @PathVariable UUID productId,
                                                  @RequestHeader("Authorization") String authHeader) {
        String jwt = extractToken(authHeader);
        orderService.addProductToOrder(productId, orderId);
        return ResponseEntity.ok().build();
    }

    /**
     * Supprime un produit d'une commande.
     * @param orderId L'ID de la commande
     * @param productId L'ID du produit à supprimer
     * @param authHeader L'en-tête d'autorisation JWT
     * @return Réponse HTTP sans contenu
     */
    @DeleteMapping("/{orderId}/product/{productId}")
    public ResponseEntity<Void> deleteProductInOrder(@PathVariable UUID orderId,
                                                     @PathVariable UUID productId,
                                                     @RequestHeader("Authorization") String authHeader) {
        String jwt = extractToken(authHeader);
        orderService.deleteProductInOrder(orderId, productId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Valide une commande après vérification du paiement Stripe.
     * @param orderId L'ID de la commande à valider
     * @param body Le corps contenant l'ID du PaymentIntent Stripe
     * @param authHeader L'en-tête d'autorisation JWT
     * @return Réponse HTTP OK si validation réussie, sinon une erreur
     * @throws StripeException En cas d'erreur Stripe
     */
    @PutMapping("/{orderId}/public")
    public ResponseEntity<?> validateOrder(
            @PathVariable UUID orderId,
            @RequestBody Map<String, String> body,
            @RequestHeader("Authorization") String authHeader
    ) throws StripeException {
        String jwt = extractToken(authHeader);
        String paymentIntentId = body.get("paymentIntentId");
        if (paymentIntentId == null) {
            return ResponseEntity.badRequest().body("paymentIntentId manquant");
        }

        User user = userService.getUserByJwt(authHeader);

        // 🔒 1. Vérifie que le paiement est bien effectué
        PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);
        if (!"succeeded".equals(intent.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Paiement non validé");
        }

        // 🔒 2. Vérifie que ce paiement appartient bien à l’utilisateur
        if (!stripeService.isPaymentIntentLinkedToUser(paymentIntentId, user.getIdUser())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Ce paiement ne vous appartient pas");
        }

        // ✅ 3. Publie la commande
        orderService.validateOrder(orderId);
        return ResponseEntity.ok().build();
    }

    /**
     * Récupère la liste des produits dans une commande.
     * @param orderId L'ID de la commande
     * @param authHeader L'en-tête d'autorisation JWT
     * @return La liste des produits au format DTO
     */
    @GetMapping("{orderId}/products")
    public ResponseEntity<List<ProductResponse>> getProductsInOrder(@PathVariable UUID orderId,
                                                                    @RequestHeader("Authorization") String authHeader){
        String jwt = extractToken(authHeader);
        List<Product> products = orderService.getProductsInOrder(orderId);
        List<ProductResponse> responses = products.stream()
                .map(ProductMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }
}


