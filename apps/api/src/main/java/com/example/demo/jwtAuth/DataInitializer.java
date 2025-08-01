package com.example.demo.jwtAuth;

import com.example.demo.product.ProductRepository;
import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    /**
     * Initialise les utilisateurs dans la base de données au démarrage de l'application.
     * Crée un utilisateur admin avec un mot de passe encodé si aucun utilisateur n'existe.
     *
     * @param userRepository     le repository pour accéder aux utilisateurs
     * @param passwordEncoder    l'encodeur de mot de passe pour sécuriser les mots de passe
     * @param productRepository  le repository des produits (non utilisé dans cette méthode mais injecté)
     * @return un CommandLineRunner qui exécute l'initialisation au démarrage
     */
    @Bean
    public CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder passwordEncoder, ProductRepository productRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User user = new User();
                user.setPseudo("admin");
                user.setEmail("admin@example.com");
                user.setPassword(passwordEncoder.encode("admin123")); // Toujours stocker un mot de passe hashé !
                user.setRole("ADMIN");
                userRepository.save(user);
            }
        };
    }
}
