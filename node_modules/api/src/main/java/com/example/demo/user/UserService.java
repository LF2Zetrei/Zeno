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
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
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
        if (updateRequest.getPassword() != null && !updateRequest.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
        }

        return userRepository.save(user);
    }
}
