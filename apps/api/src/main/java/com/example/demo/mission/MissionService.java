package com.example.demo.mission;

import com.example.demo.jwtAuth.JwtUtils;
import com.example.demo.order.Order;
import com.example.demo.order.OrderRepository;
import com.example.demo.payment.Payment;
import com.example.demo.payment.PaymentRepository;
import com.example.demo.tracking.Tracking;
import com.example.demo.tracking.TrackingRepository;
import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import com.example.demo.user.UserService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class MissionService {

    private final MissionRepository missionRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtil;
    private final UserService userService;
    private final TrackingRepository trackingRepository;
    private final PaymentRepository paymentRepository;

    public MissionService(MissionRepository missionRepository,
                          OrderRepository orderRepository,
                          UserRepository userRepository,
                          JwtUtils jwtUtil,
                          UserService userService, TrackingRepository trackingRepository, PaymentRepository paymentRepository) {
        this.missionRepository = missionRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.trackingRepository = trackingRepository;
        this.paymentRepository = paymentRepository;
    }

    public MissionResponse updateMissionStatus(UUID missionId, String newStatus) {
        System.out.println("[updateMissionStatus] MAJ missionId : " + missionId + " => " + newStatus);
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission non trouvée"));

        mission.setStatus(MissionStatus.valueOf(newStatus));
        mission.setUpdatedAt(LocalDateTime.now());
        Mission updated = missionRepository.save(mission);
        return MissionMapper.toDto(updated);
    }

    public String getMissionStatus(UUID missionId) {
        System.out.println("[getMissionStatus] Récupération status pour missionId : " + missionId);
        String status = String.valueOf(missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission non trouvée"))
                .getStatus());
        System.out.println("[getMissionStatus] Status : " + status);
        return status;
    }

    @Transactional
    public void deleteMissionAndUpdateCommande(UUID missionId) {
        Mission mission = missionRepository.findByIdMission(missionId)
                .orElseThrow(() -> new RuntimeException("Mission not found"));

        Order order = mission.getOrder();

        // Supprimer le tracking
        Tracking tracking = trackingRepository.findByMission(mission).orElseThrow(() -> new RuntimeException("Tracking not found"));
        trackingRepository.delete(tracking);

        // Supprimer le paiement
        Payment payment = paymentRepository.findByMission(mission).orElseThrow(() -> new RuntimeException("Payment not found"));
        paymentRepository.delete(payment);

        // Supprimer la mission
        missionRepository.delete(mission);

        // Mettre à jour la commande
        order.setStatus("CANCELED");
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
    }

    public List<MissionResponse> getAllMissions() {
        List<Mission> missions = missionRepository.findAll().stream().filter(mission -> mission.getIsPublic()).toList();
        return MissionMapper.toDtoList(missions);
    }

    public List<MissionResponse> getMyMissions(User user) {
        System.out.println("[getMyMissions] Missions de l'utilisateur : " + user.getIdUser());
        List<Mission> missions = missionRepository.findByTraveler(user);
        System.out.println("[getMyMissions] Missions récupérées : " + missions.size());
        return MissionMapper.toDtoList(missions);
    }

    public MissionResponse assignDeliverer(UUID missionId, User user) {
        System.out.println("[assignDeliverer] Affectation du livreur " + user.getIdUser() + " à la mission : " + missionId);
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission non trouvée"));

        mission.setTraveler(user);
        mission.setStatus(MissionStatus.ACCEPTED);
        mission.setAcceptanceDate(LocalDate.now());
        mission.setUpdatedAt(LocalDateTime.now());

        Mission updated = missionRepository.save(mission);
        return MissionMapper.toDto(updated);
    }

    public List<MissionResponse> getMissionsNearby(User user, float radiusKm) {
        System.out.println("[getMissionsNearby] Recherche des missions à proximité de : " + user.getIdUser()
                + " (lat: " + user.getLatitude() + ", lon: " + user.getLongitude() + "), rayon : " + radiusKm + "km");

        double userLat = user.getLatitude();
        double userLon = user.getLongitude();

        List<Mission> allMissions = missionRepository.findAll();
        List<Mission> nearbyMissions = new ArrayList<>();

        for (Mission mission : allMissions) {
            Tracking tracking = trackingRepository.findByMission(mission).orElse(null);
            if (tracking != null && tracking.getLatitude() != null && tracking.getLongitude() != null) {
                double distance = haversine(userLat, userLon, tracking.getLatitude(), tracking.getLongitude());
                if (distance <= radiusKm) {
                    nearbyMissions.add(mission);
                    System.out.println("[getMissionsNearby] Mission " + mission.getIdMission() + " à " + distance + " km ajoutée.");
                }
            }
        }

        System.out.println("[getMissionsNearby] Total missions à proximité : " + nearbyMissions.size());
        return MissionMapper.toDtoList(nearbyMissions);
    }

    public MissionResponse getMissionById(UUID missionId) {
        System.out.println("[getMissionById] Mission avec l'id : " + missionId);
        Mission mission = missionRepository.findByIdMission(missionId).orElseThrow(() -> new RuntimeException("Mission introuvable"));
        System.out.println("[getMissionById] Mission récupérées : ");
        return MissionMapper.toDto(mission);
    }

    public static double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double result = R * c;

        System.out.println("[haversine] Distance calculée : " + result + " km");
        return result;
    }
}
