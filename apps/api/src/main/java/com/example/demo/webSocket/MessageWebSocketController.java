package com.example.demo.webSocket;

import com.example.demo.message.Message;
import com.example.demo.message.MessageRepository;
import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import com.example.demo.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.ZonedDateTime;
import java.util.UUID;

/**
 * Contrôleur WebSocket pour gérer l'envoi de messages de chat en temps réel.
 * Cette classe utilise Spring Messaging pour recevoir les messages, les sauvegarder
 * en base, et les transmettre aux utilisateurs concernés via des destinations privées.
 */
@Controller
public class MessageWebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    // Composant Spring permettant d'envoyer des messages WebSocket aux utilisateurs spécifiques.

    @Autowired
    private MessageRepository messageRepository;
    // Repository pour persister les messages échangés.

    @Autowired
    private UserService userService;
    // Service pour récupérer les informations utilisateur via JWT.

    @Autowired
    private UserRepository userRepository;
    // Repository pour récupérer les informations utilisateur par identifiant.

    /**
     * Méthode déclenchée lorsqu'un message est reçu sur la destination "/chat/{recipientId}".
     * Elle sauvegarde le message et l'envoie à la fois au destinataire et à l'émetteur via WebSocket.
     *
     * @param recipientId UUID de l'utilisateur destinataire.
     * @param messageDto Objet contenant le contenu du message.
     * @param jwtHeader En-tête HTTP Authorization contenant le JWT de l'expéditeur.
     * @throws RuntimeException si le destinataire n'est pas trouvé en base.
     */
    @MessageMapping("/chat/{recipientId}")
    public void sendMessage(
            @DestinationVariable UUID recipientId,
            @Payload MessageDTO messageDto,
            @Header("Authorization") String jwtHeader
    ) {
        // Extraction du token JWT en retirant le préfixe "Bearer "
        String jwt = jwtHeader.replace("Bearer ", "");
        // Récupération de l'utilisateur émetteur à partir du JWT
        User sender = userService.getUserByJwt(jwt);
        // Recherche du destinataire par son UUID, erreur si non trouvé
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        // Création et sauvegarde du message en base
        Message message = new Message();
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setContent(messageDto.getContent());
        message.setSentSince(ZonedDateTime.now());
        messageRepository.save(message);

        // Envoi du message via WebSocket au destinataire (destination privée)
        messagingTemplate.convertAndSendToUser(
                recipient.getPseudo(),
                "/queue/messages",
                message
        );
        // Envoi également du message à l'émetteur (pour mise à jour client)
        messagingTemplate.convertAndSendToUser(
                sender.getPseudo(),
                "/queue/messages",
                message
        );
    }
}
