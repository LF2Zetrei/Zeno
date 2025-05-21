package com.example.demo.jwtAuth;

import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User user = new User();
                user.setEmail("admin@example.com");
                user.setPassword(passwordEncoder.encode("admin123")); // Toujours stocker un mot de passe hashé !
                user.setRole("ADMIN");
                userRepository.save(user);
            }
        };
    }
}
