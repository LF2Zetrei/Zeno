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

    public User getUserByJwt(String token) {
        // Supprimer le préfixe "Bearer " si présent
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        // Extraire le username (ici, l’email)
        String email = jwtUtils.getUserNameFromJwtToken(token);

        // Récupérer l'utilisateur
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé pour le token donné"));
    }

    public List<User> getUsersByRatingAverage() {
        return userRepository.findAllByOrderByRatingAverageDesc();
    }

    public User updateUserProfile(User user, UpdateUserRequest updateRequest) {
        if (updateRequest.getFirstName() != null) user.setFirstName(updateRequest.getFirstName());
        if (updateRequest.getLastName() != null) user.setLastName(updateRequest.getLastName());
        if (updateRequest.getPseudo() != null) user.setPseudo(updateRequest.getPseudo());
        if (updateRequest.getEmail() != null) {
            // Vérifier unicité email avant mise à jour si besoin
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

    public void updatePremiumSubscription(User user){
        user.setPremiumSubscription(!user.isPremiumSubscription());
        userRepository.save(user);
    }

    public void updateBasicSubscription(User user){
        user.setBasicSubscription(!user.isBasicSubscription());
        userRepository.save(user);
    }

    public void updateSubscription(String subscriptionType, User user){
        if ("basic".equalsIgnoreCase(subscriptionType)) {
            updateBasicSubscription(user);
        } else if ("premium".equalsIgnoreCase(subscriptionType)) {
            updatePremiumSubscription(user);
        } else {
            throw new IllegalArgumentException("Subscription type not found: " + subscriptionType);
        }
    }

    public void rateUser(String userName, Float rate) {
        User user = userRepository.findByPseudo(userName)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        int numberOfRatings = user.getNumberOfRatings();
        BigDecimal currentAverage = user.getRatingAverage() != null ? user.getRatingAverage() : BigDecimal.ZERO;

        System.out.println("Before update: ratings = " + numberOfRatings + ", average = " + currentAverage);

        BigDecimal newAverage = currentAverage
                .multiply(BigDecimal.valueOf(numberOfRatings))
                .add(BigDecimal.valueOf(rate))
                .divide(BigDecimal.valueOf(numberOfRatings + 1), 2, RoundingMode.HALF_UP);

        System.out.println("New average calculated: " + newAverage);

        user.setNumberOfRatings(numberOfRatings + 1);
        user.setRatingAverage(newAverage);

        userRepository.save(user);

        System.out.println("User saved with new ratings = " + user.getNumberOfRatings() + ", new average = " + user.getRatingAverage());
    }

    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    public String getUserRole(User user){
        return user.getRole();
    }

    public Boolean isAdmin(User user){
        return user.getRole().equals("ADMIN");
    }
}
