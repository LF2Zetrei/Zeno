package com.example.demo.mission;

import com.example.demo.user.User;
import com.example.demo.user.UserService;
import com.stripe.exception.StripeException;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/mission")
public class MissionController {

    private final MissionService missionService;
    private final MissionRepository missionRepository;
    private final UserService userService;

    public MissionController(MissionService missionService, MissionRepository missionRepository, UserService userService) {
        this.missionService = missionService;
        this.missionRepository = missionRepository;
        this.userService = userService;
    }

    /**
     * Met à jour le statut d'une mission donnée.
     *
     * @param authHeader En-tête HTTP Authorization contenant le JWT.
     * @param missionId  UUID de la mission à modifier.
     * @param status     Nouveau statut à appliquer à la mission.
     * @return ResponseEntity contenant la mission mise à jour dans un objet MissionResponse.
     */
    @PutMapping("/{missionId}/status")
    public ResponseEntity<MissionResponse> updateStatus(@RequestHeader("Authorization") String authHeader,@PathVariable UUID missionId,
                                                        @RequestParam String status) {
        return ResponseEntity.ok(missionService.updateMissionStatus(missionId, status));
    }

    /**
     * Récupère la liste des missions proches de l'utilisateur sur un rayon donné.
     *
     * @param authHeader En-tête HTTP Authorization contenant le JWT.
     * @param radiusKm   Rayon en kilomètres pour la recherche des missions proches.
     * @return ResponseEntity contenant la liste des missions proches sous forme de MissionResponse.
     */
    @GetMapping("/nearby")
    public ResponseEntity<List<MissionResponse>> getNearbyMissions(@RequestHeader("Authorization") String authHeader, @RequestParam Float radiusKm) {
        User user = userService.getUserByJwt(authHeader);
        List<MissionResponse> missions = missionService.getMissionsNearby(user, radiusKm);
        return ResponseEntity.ok(missions);
    }

    /**
     * Récupère le statut actuel d'une mission.
     *
     * @param authHeader En-tête HTTP Authorization contenant le JWT.
     * @param missionId  UUID de la mission dont on veut le statut.
     * @return ResponseEntity contenant le statut sous forme de chaîne de caractères.
     */
    @GetMapping("/{missionId}/status")
    public ResponseEntity<String> getStatus(@RequestHeader("Authorization") String authHeader,@PathVariable UUID missionId) {
        return ResponseEntity.ok(missionService.getMissionStatus(missionId));
    }

    /**
     * Récupère les détails d'une mission à partir de son UUID.
     *
     * @param missionId UUID de la mission recherchée.
     * @return ResponseEntity contenant les détails de la mission sous forme de MissionResponse.
     */
    @GetMapping("/{missionId}")
    public ResponseEntity<MissionResponse> getMissionById(@PathVariable UUID missionId) {
        return ResponseEntity.ok(missionService.getMissionById(missionId));
    }

    /**
     * Annule une mission spécifiée par son UUID et met à jour la commande associée.
     *
     * @param missionId UUID de la mission à annuler.
     * @return ResponseEntity sans contenu (204 No Content) indiquant la réussite de l'opération.
     */
    @DeleteMapping("/{missionId}")
    public ResponseEntity<Void> cancelMission(@PathVariable UUID missionId) {
        missionService.deleteMissionAndUpdateCommande(missionId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Récupère toutes les missions disponibles.
     *
     * @param authHeader En-tête HTTP Authorization contenant le JWT.
     * @return ResponseEntity contenant la liste de toutes les missions sous forme de MissionResponse.
     */
    @GetMapping
    public ResponseEntity<List<MissionResponse>> getAllMissions(@RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(missionService.getAllMissions());
    }

    /**
     * Récupère la liste des missions privées.
     *
     * @param authHeader En-tête HTTP Authorization contenant le JWT.
     * @return ResponseEntity contenant la liste des missions privées.
     */
    @GetMapping("/all")
    public ResponseEntity<List<MissionResponse>> getMissionsAll(@RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(missionService.getPrivateMissions());
    }

    /**
     * Récupère la liste des missions associées à l'utilisateur connecté.
     *
     * @param authHeader En-tête HTTP Authorization contenant le JWT.
     * @return ResponseEntity contenant la liste des missions de l'utilisateur.
     */
    @GetMapping("/me")
    public ResponseEntity<List<MissionResponse>> getMyMissions(@RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);
        return ResponseEntity.ok(missionService.getMyMissions(user));
    }

    /**
     * Assigne un livreur à une mission spécifiée.
     *
     * @param missionId UUID de la mission à laquelle assigner un livreur.
     * @param authHeader En-tête HTTP Authorization contenant le JWT.
     * @return ResponseEntity contenant la mission mise à jour avec le livreur assigné.
     */
    @PostMapping("/{missionId}/assign")
    public ResponseEntity<MissionResponse> assignDeliverer(@PathVariable UUID missionId,
                                                           @RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);
        return ResponseEntity.ok(missionService.assignDeliverer(missionId, user));
    }

    /**
     * Extrait le token JWT de l'en-tête Authorization.
     *
     * @param authHeader En-tête Authorization au format "Bearer <token>".
     * @return Le token JWT extrait.
     * @throws RuntimeException si le token est manquant ou mal formé.
     */
    private String extractToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        throw new RuntimeException("Token manquant ou invalide");
    }

    /**
     * Crée une mission à partir d'une commande identifiée par son UUID.
     *
     * @param orderId    UUID de la commande source.
     * @param authHeader En-tête HTTP Authorization contenant le JWT.
     * @return Objet MissionResponse représentant la mission créée.
     */
    @PostMapping("/{orderId}")
    public MissionResponse createMissionFromOrder(@PathVariable UUID orderId, @RequestHeader("Authorization") String authHeader) {
        return missionService.createMissionFromOrder(orderId);
    }

    /**
     * Désassigne le livreur d'une mission donnée.
     *
     * @param missionId  UUID de la mission concernée.
     * @param authHeader En-tête HTTP Authorization contenant le JWT.
     * @return ResponseEntity contenant la mission mise à jour.
     */
    @PutMapping("/{missionId}/unassign")
    public ResponseEntity<MissionResponse> unAssignDeliverer(@PathVariable UUID missionId,
                                                             @RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);
        return ResponseEntity.ok(missionService.unAssignDeliver(missionId, user));
    }

    /**
     * Marque une mission comme reçue par le livreur.
     *
     * @param missionId  UUID de la mission.
     * @param authHeader En-tête HTTP Authorization contenant le JWT.
     * @return ResponseEntity sans contenu indiquant la réussite de l'opération.
     * @throws StripeException en cas d'erreur lors du traitement du paiement Stripe.
     */
    @PutMapping("/{missionId}/received")
    public ResponseEntity<?> receivedMission(@PathVariable UUID missionId, @RequestHeader("Authorization") String authHeader) throws StripeException {
        User user = userService.getUserByJwt(authHeader);
        missionService.received(missionId, user);
        return ResponseEntity.noContent().build();
    }

    /**
     * Marque une mission comme livrée.
     *
     * @param missionId  UUID de la mission.
     * @param authHeader En-tête HTTP Authorization contenant le JWT.
     * @return ResponseEntity sans contenu indiquant la réussite de l'opération.
     * @throws StripeException en cas d'erreur lors du traitement du paiement Stripe.
     */
    @PutMapping("/{missionId}/delivered")
    public ResponseEntity<?> deliveredMission(@PathVariable UUID missionId, @RequestHeader("Authorization") String authHeader) throws StripeException {
        User user = userService.getUserByJwt(authHeader);
        missionService.delivered(missionId, user);
        return ResponseEntity.noContent().build();
    }
}
