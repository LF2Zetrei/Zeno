package com.example.demo.order;

import com.example.demo.mission.*;
import com.example.demo.order_product.OrderProduct;
import com.example.demo.order_product.OrderProductRepository;
import com.example.demo.payment.Payment;
import com.example.demo.payment.PaymentController;
import com.example.demo.payment.PaymentRepository;
import com.example.demo.product.Product;
import com.example.demo.product.ProductRepository;
import com.example.demo.tracking.Tracking;
import com.example.demo.tracking.TrackingRepository;
import com.example.demo.tracking.TrackingResponseDto;
import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import com.example.demo.user.UserService;
import jakarta.transaction.Transactional;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
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

    public OrderResponse createOrder(OrderRequest request, User user) throws Exception {
        double[] coords = getLatLongFromAddress(request.getPurchaseAddress()+ " " +request.getCity()+ " "+request.getPurchaseCountry());

        Order order = new Order();
        order.setBuyer(user);
        order.setPurchaseAddress(request.getPurchaseAddress());
        order.setPurchaseCountry(request.getPurchaseCountry());
        order.setDeadline(request.getDeadline());
        order.setArtisanName(request.getArtisanName());
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        order.setPriceEstimation(0.0F);
        order.setStatus("PENDING");
        order.setCity(request.getCity());
        order.setLatitude((float) coords[0]);
        order.setLongitude((float) coords[1]);
        order.setTransports(request.getTransports());
        orderRepository.save(order);

        Mission mission = new Mission();
        mission.setOrder(order);
        mission.setCreatedAt(LocalDateTime.now());
        mission.setUpdatedAt(LocalDateTime.now());
        mission.setStatus(MissionStatus.PENDING);
        mission.setIsPublic(false);
        mission.setMissionDelivered(false);
        mission.setMissionReceived(false);
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

    public OrderResponse updateOrder(UUID orderId, OrderRequest request, String jwt) {
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
        order.setTransports(request.getTransports());
        orderRepository.save(order);

        Mission mission = missionRepository.findByOrder(order).orElseThrow(() -> new RuntimeException("Mission introuvable"));
        mission.setOrder(order);
        missionRepository.save(mission);

        return mapToResponse(order);
    }


    @Transactional
    public void cancelOrder(UUID orderId, String jwt) {

        User user = userService.getUserByJwt(jwt);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        Mission mission = missionRepository.findByOrder_IdOrder(order.getIdOrder())
                .orElse(null); // mission peut être null

        List<OrderProduct> orderProducts = orderProductRepository.findByOrder(order);

        if (!order.getBuyer().getIdUser().equals(user.getIdUser())) {
            throw new RuntimeException("Non autorisé à supprimer cette commande, vous n'êtes pas la personne qui a crée cette commande");
        }

        if(mission != null && mission.getAcceptanceDate() != null) {
            throw new RuntimeException("Non autorisé à supprimer cette commande car la mission est déjà acceptée");
        }

        orderProductRepository.deleteAll(orderProducts);

        if (mission != null) {
            // Supprimer d'abord le lien mission -> tracking
            trackingRepository.findByMission(mission).ifPresent(trackingRepository::delete);

            paymentRepository.findByMission(mission).ifPresent(paymentRepository::delete);

            mission.setOrder(null); // facultatif mais évite les surprises
            missionRepository.save(mission);
            missionRepository.delete(mission);
        }

        orderRepository.delete(order);
    }


    public List<OrderResponse> getMyOrders(String jwt) {
        User user = userService.getUserByJwt(jwt);
        List<Order> orders = orderRepository.findByBuyer(user);
        return orders.stream().map(this::mapToResponse).toList();
    }


    public OrderResponse getOrderById(UUID orderId, String jwt) {
        User user = userService.getUserByJwt(jwt);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        return mapToResponse(order);
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

        Mission mission = missionRepository.findByOrder(order).orElseThrow(() -> new RuntimeException("Mission introuvable"));
        Payment payment = paymentRepository.findByMission(mission).orElseThrow(() -> new RuntimeException("Payment introuvable"));
        payment.setAmount(order.getPriceEstimation());
        paymentRepository.save(payment);

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

        Mission mission = missionRepository.findByOrder(order).orElseThrow(() -> new RuntimeException("Mission introuvable"));
        Payment payment = paymentRepository.findByMission(mission).orElseThrow(() -> new RuntimeException("Payment introuvable"));
        payment.setAmount(order.getPriceEstimation());
        paymentRepository.save(payment);
    }

    /**
     * ✅ Méthode de mapping tolérante au `null`
     */
    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .idOrder(order.getIdOrder())
                .buyer(order.getBuyer())
                .purchaseAddress(order.getPurchaseAddress())
                .purchaseCountry(order.getPurchaseCountry())
                .deadline(order.getDeadline())
                .priceEstimation(order.getPriceEstimation())
                .artisanName(order.getArtisanName())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .city(order.getCity())
                .latitude(order.getLatitude())
                .longitude(order.getLongitude())
                .build();
    }

    public OrderResponse updateOrderStatus(UUID orderId, String newStatus) {
        System.out.println("[updateOrderStatus] MAJ OrderId : " + orderId + " => " + newStatus);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Mission non trouvée"));

        order.setStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        return mapToResponse(order);
    }


    public String getOrderStatus(UUID orderId) {
        System.out.println("[getOrderStatus] Récupération status pour orderId : " + orderId);
        String status = String.valueOf(orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order non trouvée"))
                .getStatus());
        System.out.println("[getOrderStatus] Status : " + status);
        return status;
    }

    public void validateOrder(UUID orderId) {
        Order order = orderRepository.findByIdOrder(orderId).orElseThrow(() -> new RuntimeException("Commande introuvable"));
        Mission mission = missionRepository.findByOrder(order).orElseThrow(() -> new RuntimeException("Mission introuvable"));
        Payment payment = paymentRepository.findByMission(mission).orElseThrow(() -> new RuntimeException("Payment introuvable"));
        mission.setIsPublic(true);
        missionRepository.save(mission);
        payment.setStatus("SUCCEEDED");
        paymentRepository.save(payment);

    }
    public Mission getMissionByOrderId(UUID orderId) {
        return missionRepository.findByOrder_IdOrder(orderId).orElseThrow(() -> new RuntimeException("Mission introuvable"));
    }
    public List<Product> getProductsInOrder(UUID orderId) {
        Order order = orderRepository.findByIdOrder(orderId).orElseThrow(() -> new RuntimeException("Commande introuvable"));
        return order.getOrderProducts().stream().map(OrderProduct::getProduct).toList();
    }

    public static double[] getLatLongFromAddress(String address) throws Exception {
        String encodedAddress = java.net.URLEncoder.encode(address, java.nio.charset.StandardCharsets.UTF_8);
        String url = "https://nominatim.openstreetmap.org/search?q=" + encodedAddress + "&format=json&limit=1";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("User-Agent", "JavaGeocodingApp") // obligatoire pour Nominatim
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        JSONArray results = new JSONArray(response.body());

        if (!results.isEmpty()) {
            JSONObject location = results.getJSONObject(0);
            double lat = Double.parseDouble(location.getString("lat"));
            double lon = Double.parseDouble(location.getString("lon"));
            return new double[] { lat, lon };
        } else {
            throw new Exception("Aucun résultat trouvé pour l'adresse : " + address);
        }
    }


}
