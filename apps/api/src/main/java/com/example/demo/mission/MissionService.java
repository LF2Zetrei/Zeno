package com.example.demo.mission;

import com.example.demo.jwtAuth.JwtUtils;
import com.example.demo.order.Order;
import com.example.demo.order.OrderRepository;
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

    public MissionService(MissionRepository missionRepository,
                          OrderRepository orderRepository,
                          UserRepository userRepository,
                          JwtUtils jwtUtil,
                          UserService userService, TrackingRepository trackingRepository) {
        this.missionRepository = missionRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.trackingRepository = trackingRepository;
    }

    @Transactional
    public MissionResponse createMission(UUID orderId) {
        System.out.println("[createMission] Création mission pour orderId : " + orderId);
        Order order = orderRepository.findByIdOrder(orderId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));

        if (missionRepository.findByOrder_IdOrder(orderId).isPresent()) {
            throw new RuntimeException("Mission déjà existante pour cette commande");
        }

        Mission mission = new Mission();
        mission.setIdMission(UUID.randomUUID());
        mission.setOrder(order);
        mission.setCreatedAt(LocalDateTime.now());
        mission.setUpdatedAt(LocalDateTime.now());
        mission.setStatus(MissionStatus.PENDING);

        Mission saved = missionRepository.save(mission);
        return MissionMapper.toDto(saved);
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

    public void cancelMission(UUID missionId) {
        System.out.println("[cancelMission] Annulation missionId : " + missionId);
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission non trouvée"));

        if ("ACCEPTED".equalsIgnoreCase(String.valueOf(mission.getStatus()))) {
            throw new RuntimeException("Impossible d'annuler une mission déjà acceptée");
        }
        Tracking tracking = mission.getTracking();
        trackingRepository.delete(tracking);

        missionRepository.delete(mission);
        System.out.println("[cancelMission] Mission supprimée.");
    }

    public List<MissionResponse> getAllMissions() {
        List<Mission> missions = missionRepository.findAll();
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
            Tracking tracking = mission.getTracking();
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
