package com.example.demo.order;

import com.example.demo.mission.Mission;
import com.example.demo.mission.MissionRepository;
import com.example.demo.mission.MissionService;
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

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository,
                        UserService userService,
                        MissionRepository missionRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.missionRepository = missionRepository;
    }

    public Order createOrder(OrderRequest request, String jwt) {
        User user = userService.getUserByJwt(jwt); // ✅ Utilise UserService

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));

        Order order = new Order();
        order.setBuyer(user);
        order.setPurchaseAddress(request.getPurchaseAddress());
        order.setPurchaseCountry(request.getPurchaseCountry());
        order.setDeadline(request.getDeadline());
        order.setArtisanName(request.getArtisanName());
        order.setPriceEstimation(product.getEstimatedPrice());
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        orderRepository.save(order);

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
}
