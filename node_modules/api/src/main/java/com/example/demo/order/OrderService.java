package com.example.demo.order;

import com.example.demo.mission.Mission;
import com.example.demo.mission.MissionRepository;
import com.example.demo.mission.MissionStatus;
import com.example.demo.order_product.OrderProduct;
import com.example.demo.order_product.OrderProductRepository;
import com.example.demo.payment.Payment;
import com.example.demo.payment.PaymentRepository;
import com.example.demo.product.Product;
import com.example.demo.product.ProductRepository;
import com.example.demo.tracking.Tracking;
import com.example.demo.tracking.TrackingRepository;
import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import com.example.demo.user.UserService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final MissionRepository missionRepository;
    private final OrderProductRepository orderProductRepository;
    private final TrackingRepository trackingRepository;
    private final PaymentRepository paymentRepository;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository,
                        UserService userService,
                        MissionRepository missionRepository,
                        OrderProductRepository orderProductRepository,
                        TrackingRepository trackingRepository, PaymentRepository paymentRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.missionRepository = missionRepository;
        this.orderProductRepository = orderProductRepository;
        this.trackingRepository = trackingRepository;
        this.paymentRepository = paymentRepository;
    }

    public OrderResponse createOrder(OrderRequest request, User user) {
        Order order = new Order();
        order.setBuyer(user);
        order.setPurchaseAddress(request.getPurchaseAddress());
        order.setPurchaseCountry(request.getPurchaseCountry());
        order.setDeadline(request.getDeadline());
        order.setArtisanName(request.getArtisanName());
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        order.setPriceEstimation(0.0F);
        orderRepository.save(order);

        Mission mission = new Mission();
        mission.setOrder(order);
        mission.setCreatedAt(LocalDateTime.now());
        mission.setUpdatedAt(LocalDateTime.now());
        mission.setStatus(MissionStatus.PENDING);
        missionRepository.save(mission);

        Tracking tracking = new Tracking();
        tracking.setCreatedAt(LocalDateTime.now());
        tracking.setUpdatedAt(LocalDateTime.now());
        tracking.setMission(mission);
        tracking.setTimestamp(LocalDateTime.now());
        tracking.setLatitude(null);
        tracking.setLongitude(null);
        trackingRepository.save(tracking);

        Payment payment = new Payment();
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        payment.setMission(mission);
        payment.setStatus("en attente");
        payment.setStripeId(null);
        payment.setAmount(order.getPriceEstimation());
        paymentRepository.save(payment);

        return mapToResponse(order);
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

        Mission mission = missionRepository.findByOrder_IdOrder(order.getIdOrder())
                .orElse(null); // On accepte qu’il n’y ait pas de mission

        List<OrderProduct> orderProducts = orderProductRepository.findByOrder(order);

        if (!order.getBuyer().getIdUser().equals(user.getIdUser())) {
            throw new RuntimeException("Non autorisé à supprimer cette commande");
        }

        orderProductRepository.deleteAll(orderProducts);
        if (mission != null) {
            missionRepository.delete(mission);
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

    @Transactional
    public void addProductToOrder(UUID productId, UUID orderId) {
        Order order = orderRepository.findByIdOrder(orderId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        Product product = productRepository.findByIdProduct(productId)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));

        if (orderProductRepository.existsByOrderAndProduct(order, product)) {
            throw new RuntimeException("Le produit est déjà associé à cette commande.");
        }

        OrderProduct orderProduct = new OrderProduct(order, product, product.getEstimatedPrice());
        orderProductRepository.save(orderProduct);

        // Mettre à jour la liste des produits dans l'entité Order (si la collection existe)
        if (order.getOrderProducts() != null) {
            order.getOrderProducts().add(orderProduct);
        }

        order.setPriceEstimation(order.getPriceEstimation() + product.getEstimatedPrice());
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
    }


    public void deleteProductInOrder(UUID orderId, UUID productId) {
        Order order = orderRepository.findByIdOrder(orderId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        Product product = productRepository.findByIdProduct(productId)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));

        OrderProduct orderProduct = orderProductRepository
                .findByOrderAndProduct(order, product)
                .orElseThrow(() -> new RuntimeException("Le produit n'existe pas dans cette commande."));

        orderProductRepository.delete(orderProduct);

        order.setPriceEstimation(order.getPriceEstimation() - product.getEstimatedPrice());
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
    }

    /**
     * ✅ Méthode de mapping tolérante au `null`
     */
    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .idOrder(order.getIdOrder())
                .purchaseAddress(order.getPurchaseAddress())
                .purchaseCountry(order.getPurchaseCountry())
                .deadline(order.getDeadline())
                .priceEstimation(order.getPriceEstimation())
                .artisanName(order.getArtisanName())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
