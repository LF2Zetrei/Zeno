package com.example.demo.user;

import com.example.demo.jwtAuth.JwtUtils;
import com.example.demo.mission.Mission;
import com.example.demo.mission.MissionRepository;
import com.example.demo.order.Order;
import com.example.demo.order.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final MissionRepository missionRepository;

    public UserService(UserRepository userRepository, JwtUtils jwtUtils, PasswordEncoder passwordEncoder, MissionRepository missionRepository) {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
        this.missionRepository = missionRepository;
    }

    /**
     * Récupère un utilisateur à partir d’un token JWT.
     *
     * @param token Le token JWT (avec ou sans préfixe "Bearer ").
     * @return L'utilisateur correspondant au token.
     * @throws UsernameNotFoundException si aucun utilisateur ne correspond au token.
     */
    public User getUserByJwt(String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        String email = jwtUtils.getUserNameFromJwtToken(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé pour le token donné"));
    }

    /**
     * Récupère la liste des utilisateurs triés par moyenne des notes (du plus élevé au plus bas).
     *
     * @return Liste des utilisateurs ordonnés par moyenne de notation décroissante.
     */
    public List<User> getUsersByRatingAverage() {
        return userRepository.findAllByOrderByRatingAverageDesc();
    }

    /**
     * Met à jour la position géographique (longitude et latitude) d’un utilisateur.
     *
     * @param user      L'utilisateur à mettre à jour.
     * @param longitude Nouvelle longitude.
     * @param latitude  Nouvelle latitude.
     */
    public void updateUserPosition(User user, Double longitude, Double latitude){
        user.setLongitude(longitude);
        user.setLatitude(latitude);
        userRepository.save(user);
    }

    /**
     * Met à jour le profil d’un utilisateur à partir des données fournies.
     * Valide notamment l’unicité de l’email et encode le mot de passe si modifié.
     *
     * @param user          L'utilisateur à mettre à jour.
     * @param updateRequest Objet contenant les champs à mettre à jour.
     * @return L’utilisateur mis à jour et sauvegardé en base.
     * @throws IllegalArgumentException si l’email est déjà utilisé par un autre utilisateur.
     */
    public User updateUserProfile(User user, UpdateUserRequest updateRequest) {
        if (updateRequest.getFirstName() != null) user.setFirstName(updateRequest.getFirstName());
        if (updateRequest.getLastName() != null) user.setLastName(updateRequest.getLastName());
        if (updateRequest.getPseudo() != null) user.setPseudo(updateRequest.getPseudo());
        if (updateRequest.getEmail() != null) {
            if (!user.getEmail().equals(updateRequest.getEmail()) &&
                    userRepository.existsByEmail(updateRequest.getEmail())) {
                throw new IllegalArgumentException("Email déjà utilisé");
            }
            user.setEmail(updateRequest.getEmail());
        }
        if (updateRequest.getPhone() != null) user.setPhone(updateRequest.getPhone());
        if (updateRequest.getCountry() != null) user.setCountry(updateRequest.getCountry());
        if (updateRequest.getAddress() != null) user.setAddress(updateRequest.getAddress());
        if (updateRequest.getPostalCode() != null) user.setPostalCode(updateRequest.getPostalCode());
        if (updateRequest.getPassword() != null && !updateRequest.getPassword().isBlank() && !Objects.equals(updateRequest.getPassword(), user.getPassword())) {
            user.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
        }
        return userRepository.save(user);
    }

    /**
     * Active ou désactive l’abonnement premium d’un utilisateur.
     * Désactive l’abonnement basique si l’abonnement premium est activé.
     *
     * @param user L'utilisateur dont l’abonnement premium est à basculer.
     */
    public void updatePremiumSubscription(User user){
        user.setPremiumSubscription(!user.isPremiumSubscription());
        if (user.isBasicSubscription()) {
            user.setPremiumSubscription(false);
        }
        userRepository.save(user);
    }

    /**
     * Active ou désactive l’abonnement basique d’un utilisateur.
     * Désactive l’abonnement premium si l’abonnement basique est activé.
     *
     * @param user L'utilisateur dont l’abonnement basique est à basculer.
     */
    public void updateBasicSubscription(User user){
        user.setBasicSubscription(!user.isBasicSubscription());
        if (user.isBasicSubscription()) {
            user.setPremiumSubscription(false);
        }
        userRepository.save(user);
    }

    /**
     * Met à jour l’abonnement d’un utilisateur selon le type spécifié ("basic" ou "premium").
     *
     * @param subscriptionType Type d’abonnement ("basic" ou "premium").
     * @param user             Utilisateur concerné.
     * @throws IllegalArgumentException si le type d’abonnement est invalide.
     */
    public void updateSubscription(String subscriptionType, User user){
        if ("basic".equalsIgnoreCase(subscriptionType)) {
            updateBasicSubscription(user);
        } else if ("premium".equalsIgnoreCase(subscriptionType)) {
            updatePremiumSubscription(user);
        } else {
            throw new IllegalArgumentException("Subscription type not found: " + subscriptionType);
        }
    }

    /**
     * Met à jour le rôle d’un utilisateur entre "USER" et "DELIVER".
     * Les seules transitions autorisées sont USER -> DELIVER et DELIVER -> USER.
     *
     * @param user Utilisateur dont le rôle doit être modifié.
     * @param role Nouveau rôle ("USER" ou "DELIVER").
     * @throws IllegalArgumentException si le rôle est invalide ou la transition non autorisée.
     */
    public void updateUserRole(User user, String role) {
        if (!role.equals("USER") && !role.equals("DELIVER")) {
            throw new IllegalArgumentException("Role is invalid: " + role);
        }
        String currentRole = user.getRole();
        boolean isAllowedTransition =
                (currentRole.equals("USER") && role.equals("DELIVER")) ||
                        (currentRole.equals("DELIVER") && role.equals("USER"));
        if (!isAllowedTransition) {
            throw new IllegalArgumentException("You can only switch between USER and DELIVER");
        }
        user.setRole(role);
        userRepository.save(user);
    }

    /**
     * Ajoute une note à un utilisateur en recalculant sa moyenne.
     *
     * @param userName Pseudo de l’utilisateur à noter.
     * @param rate     Note à ajouter (float).
     * @throws IllegalArgumentException si l’utilisateur n’est pas trouvé.
     */
    public void rateUser(String userName, Float rate) {
        User user = userRepository.findByPseudo(userName)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        int numberOfRatings = user.getNumberOfRatings();
        BigDecimal currentAverage = user.getRatingAverage() != null ? user.getRatingAverage() : BigDecimal.ZERO;

        BigDecimal newAverage = currentAverage
                .multiply(BigDecimal.valueOf(numberOfRatings))
                .add(BigDecimal.valueOf(rate))
                .divide(BigDecimal.valueOf(numberOfRatings + 1), 2, RoundingMode.HALF_UP);

        user.setNumberOfRatings(numberOfRatings + 1);
        user.setRatingAverage(newAverage);
        userRepository.save(user);
    }

    /**
     * Supprime un utilisateur.
     *
     * @param user Utilisateur à supprimer.
     */
    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    /**
     * Retourne le rôle actuel d’un utilisateur.
     *
     * @param user Utilisateur concerné.
     * @return Le rôle sous forme de chaîne ("USER", "DELIVER", "ADMIN", etc.).
     */
    public String getUserRole(User user){
        return user.getRole();
    }

    /**
     * Vérifie si un utilisateur possède le rôle ADMIN.
     *
     * @param user Utilisateur à vérifier.
     * @return true si l’utilisateur est administrateur, false sinon.
     */
    public Boolean isAdmin(User user){
        return user.getRole().equals("ADMIN");
    }
}
