package com.example.demo.jwtAuth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    /**
     * Tableau des URLs front-end autorisées pour les requêtes CORS.
     */
    @Value("${frontend.urls}")
    private String[] allowedOrigins;

    private final JwtAuthenticationFilter jwtAuthFilter;

    /**
     * Constructeur injectant le filtre d'authentification JWT.
     *
     * @param jwtAuthFilter filtre personnalisé pour l'authentification JWT
     */
    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    /**
     * Configure la chaîne de filtres de sécurité HTTP.
     *
     * - Désactive la protection CSRF (car usage d'API stateless).
     * - Active la configuration CORS selon les URLs autorisées.
     * - Permet l'accès non authentifié aux endpoints d'authentification et WebSocket.
     * - Exige une authentification pour toutes les autres requêtes.
     * - Configure la gestion de session en mode stateless (pas de session côté serveur).
     * - Ajoute le filtre JWT avant le filtre d'authentification standard.
     *
     * @param http objet HttpSecurity à configurer
     * @return la SecurityFilterChain configurée
     * @throws Exception en cas d'erreur de configuration
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/ws-native/**", "/ws/**").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Fournit un AuthenticationManager à partir de la configuration d'authentification.
     * Utile pour gérer les processus d'authentification (login).
     *
     * @param authConfig configuration d'authentification Spring Security
     * @return AuthenticationManager prêt à être utilisé
     * @throws Exception en cas d'erreur lors de la récupération du gestionnaire
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    /**
     * Bean pour encoder les mots de passe en utilisant BCrypt, un algorithme sécurisé.
     * Utilisé pour stocker les mots de passe hashés et pour vérifier les correspondances.
     *
     * @return un PasswordEncoder basé sur BCrypt
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configure la politique CORS (Cross-Origin Resource Sharing) pour autoriser les
     * requêtes provenant des URLs front-end définies.
     *
     * - Autorise les méthodes HTTP GET, POST, PUT, DELETE, OPTIONS.
     * - Autorise les en-têtes "Authorization" et "Content-Type".
     * - Permet l'envoi des cookies (credentials).
     *
     * @return la configuration source CORS à utiliser dans la sécurité web
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(allowedOrigins));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
