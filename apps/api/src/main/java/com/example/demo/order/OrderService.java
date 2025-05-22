package com.example.demo.order;

import com.example.demo.mission.Mission;
import com.example.demo.mission.MissionRepository;
import com.example.demo.mission.MissionService;
import com.example.demo.order_product.OrderProduct;
import com.example.demo.order_product.OrderProductRepository;
import com.example.demo.product.Product;
import com.example.demo.product.ProductRepository;
import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import com.example.demo.user.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final UserService userService; // ✅ On injecte UserService
    private final MissionRepository missionRepository;
    private final OrderProductRepository orderProductRepository;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository,
                        UserService userService,
                        MissionRepository missionRepository, OrderProductRepository orderProductRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.missionRepository = missionRepository;
        this.orderProductRepository = orderProductRepository;
    }

    public Order createOrder(OrderRequest request, String jwt) {
        User user = userService.getUserByJwt(jwt);

        Order order = new Order();
        order.setBuyer(user);
        order.setPurchaseAddress(request.getPurchaseAddress());
        order.setPurchaseCountry(request.getPurchaseCountry());
        order.setDeadline(request.getDeadline());
        order.setArtisanName(request.getArtisanName());
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        // Sauvegarde de la commande (génère un id)
        orderRepository.save(order);

        for (UUID productId : request.getProductIds()) {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Produit introuvable"));

            OrderProduct orderProduct = new OrderProduct(order, product, product.getEstimatedPrice());
            order.getOrderProducts().add(orderProduct);
        }

        // Sauvegarder l'ordre avec ses produits
        orderRepository.save(order);

        // Création d’une mission associée
        Mission mission = new Mission();
        mission.setIdMission(UUID.randomUUID());
        mission.setOrder(order);
        mission.setCreatedAt(LocalDateTime.now());
        mission.setUpdatedAt(LocalDateTime.now());
        mission.setStatus("PENDING");
        missionRepository.save(mission);

        return order;
    }

    public Order updateOrder(UUID orderId, OrderRequest request, String jwt) {
        User user = userService.getUserByJwt(jwt);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        if (!order.getBuyer().getIdUser().equals(user.getIdUser())) {
            throw new RuntimeException("Non autorisé à modifier cette commande");
        }

        order.setPurchaseAddress(request.getPurchaseAddress());
        order.setPurchaseCountry(request.getPurchaseCountry());
        order.setDeadline(request.getDeadline());
        order.setArtisanName(request.getArtisanName());
        order.setUpdatedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }

    public void cancelOrder(UUID orderId, String jwt) {
        User user = userService.getUserByJwt(jwt);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        if (!order.getBuyer().getIdUser().equals(user.getIdUser())) {
            throw new RuntimeException("Non autorisé à supprimer cette commande");
        }

        orderRepository.delete(order);
    }

    public List<Order> getMyOrders(String jwt) {
        User user = userService.getUserByJwt(jwt);
        return orderRepository.findByBuyer(user);
    }

    public Order getOrderById(UUID orderId, String jwt) {
        User user = userService.getUserByJwt(jwt);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        if (!order.getBuyer().getIdUser().equals(user.getIdUser())) {
            throw new RuntimeException("Non autorisé à voir cette commande");
        }

        return order;
    }

    public void addProductToOrder(UUID productId, UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));

        // Vérifie si le produit est déjà dans la commande
        if (orderProductRepository.existsByOrderAndProduct(order, product)) {
            throw new RuntimeException("Le produit est déjà associé à cette commande.");
        }

        OrderProduct orderProduct = new OrderProduct(order, product, product.getEstimatedPrice());
        orderProductRepository.save(orderProduct);

        order.setPriceEstimation(order.getPriceEstimation() + product.getEstimatedPrice());
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
    }

    public void deleteProductInOrder(UUID orderId, UUID productId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));

        OrderProduct orderProduct = orderProductRepository
                .findByOrderAndProduct(order, product)
                .orElseThrow(() -> new RuntimeException("Le produit n'existe pas dans cette commande."));

        orderProductRepository.delete(orderProduct);

        order.setPriceEstimation(order.getPriceEstimation() - product.getEstimatedPrice());
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
    }
}
