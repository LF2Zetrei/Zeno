package com.example.demo.mission;

import com.example.demo.jwtAuth.JwtUtils;
import com.example.demo.order.Order;
import com.example.demo.order.OrderRepository;
import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import com.example.demo.user.UserService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class MissionService {

    private final MissionRepository missionRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtil;
    private final UserService userService;

    public MissionService(MissionRepository missionRepository,
                          OrderRepository orderRepository,
                          UserRepository userRepository,
                          JwtUtils jwtUtil, UserService userService) {
        this.missionRepository = missionRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @Transactional
    public Mission createMission(UUID orderId) {
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
        mission.setStatus("PENDING");

        return missionRepository.save(mission);
    }

    public Mission updateMissionStatus(UUID missionId, String newStatus) {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission non trouvée"));

        mission.setStatus(newStatus);
        mission.setUpdatedAt(LocalDateTime.now());
        return missionRepository.save(mission);
    }

    public String getMissionStatus(UUID missionId) {
        return missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission non trouvée"))
                .getStatus();
    }

    public void cancelMission(UUID missionId) {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission non trouvée"));

        if ("ACCEPTED".equalsIgnoreCase(mission.getStatus())) {
            throw new RuntimeException("Impossible d'annuler une mission déjà acceptée");
        }

        missionRepository.delete(mission);
    }

    public List<Mission> getAllMissions() {
        return missionRepository.findAll();
    }

    public List<Mission> getMyMissions(String jwt) {
        User traveler = userService.getUserByJwt(jwt);
        return missionRepository.findByTraveler(traveler);
    }

    public Mission assignDeliverer(UUID missionId, String jwt) {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission non trouvée"));

        User traveler = userService.getUserByJwt(jwt);
        mission.setTraveler(traveler);
        mission.setStatus("ACCEPTED");
        mission.setAcceptanceDate(LocalDate.now());
        mission.setUpdatedAt(LocalDateTime.now());

        return missionRepository.save(mission);
    }
}
