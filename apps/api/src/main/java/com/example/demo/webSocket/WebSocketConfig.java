package com.example.demo.webSocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

/**
 * Configuration WebSocket avec support STOMP pour la messagerie en temps réel.
 *
 * <p>Cette classe configure :</p>
 * <ul>
 *   <li>Les brokers de messages côté serveur (topics et queues).</li>
 *   <li>Les préfixes d'URL pour les destinations des messages.</li>
 *   <li>Les endpoints STOMP accessibles via SockJS.</li>
 *   <li>L'intercepteur JWT pour sécuriser les connexions WebSocket entrantes.</li>
 * </ul>
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtAuthChannelInterceptor jwtAuthChannelInterceptor;
    // Intercepteur pour vérifier et valider le JWT sur les canaux entrants

    /**
     * Constructeur avec injection de l'intercepteur JWT.
     *
     * @param jwtAuthChannelInterceptor Intercepteur de sécurité JWT
     */
    public WebSocketConfig(JwtAuthChannelInterceptor jwtAuthChannelInterceptor) {
        this.jwtAuthChannelInterceptor = jwtAuthChannelInterceptor;
    }

    /**
     * Configure le broker de messages côté serveur.
     *
     * <ul>
     *   <li>Active un broker simple avec les destinations "/topic" (broadcast) et "/queue" (messages privés).</li>
     *   <li>Définit le préfixe pour les destinations utilisateur "/user".</li>
     *   <li>Définit le préfixe des destinations applicatives "/app" (où les contrôleurs @MessageMapping écoutent).</li>
     * </ul>
     *
     * @param config MessageBrokerRegistry à configurer
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setUserDestinationPrefix("/user");
        config.setApplicationDestinationPrefixes("/app");
    }

    /**
     * Enregistre les endpoints STOMP exposés aux clients.
     *
     * <ul>
     *   <li>/ws : endpoint WebSocket principal avec support SockJS (fallback pour navigateurs non compatibles).</li>
     *   <li>/ws-native : second endpoint WebSocket également accessible avec SockJS.</li>
     * </ul>
     *
     * @param registry StompEndpointRegistry pour enregistrer les endpoints
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")  // Permet toutes origines (à restreindre en prod)
                .withSockJS();

        registry.addEndpoint("/ws-native")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    /**
     * Configure le canal inbound client pour y ajouter un intercepteur.
     *
     * <p>L'intercepteur JWT est appliqué afin de sécuriser et valider les messages entrants.</p>
     *
     * @param registration ChannelRegistration pour configurer les interceptors
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(jwtAuthChannelInterceptor);
    }
}
