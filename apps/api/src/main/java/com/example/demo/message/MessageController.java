package com.example.demo.message;

import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import com.example.demo.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Controller REST pour gérer les opérations liées aux messages entre utilisateurs.
 *
 * <p>Ce controller permet de créer des messages, récupérer les messages échangés,
 * lister les contacts avec qui l'utilisateur a échangé, et accéder aux messages par ID.</p>
 *
 * <p>Les endpoints sont sécurisés, nécessitant un token JWT dans l'en-tête "Authorization".</p>
 */
@RestController
@RequestMapping("/api/message")
public class MessageController {

    private final MessageService messageService;
    private final UserService userService;
    private final UserRepository userRepository;

    /**
     * Constructeur pour injecter les dépendances nécessaires.
     *
     * @param messageService service de gestion des messages
     * @param userService service de gestion des utilisateurs et extraction depuis JWT
     * @param userRepository repository pour accéder aux données utilisateurs
     */
    public MessageController(MessageService messageService, UserService userService, UserRepository userRepository) {
        this.messageService = messageService;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    /**
     * Crée un nouveau message destiné à un utilisateur identifié par son UUID.
     *
     * @param userId UUID de l'utilisateur destinataire du message
     * @param content contenu textuel du message
     * @param authorization token JWT extrait de l'en-tête Authorization
     * @return le message créé encapsulé dans une ResponseEntity
     */
    @PostMapping("/{userId}")
    public ResponseEntity<Message> createMessage(
            @PathVariable UUID userId,
            @RequestParam String content,
            @RequestHeader("Authorization") String authorization) {
        User user = userService.getUserByJwt(authorization);
        return ResponseEntity.ok(messageService.createMessage(userId, content, user));
    }

    /**
     * Récupère tous les messages échangés avec un contact donné.
     *
     * @param contactId UUID du contact avec qui les messages ont été échangés
     * @param authorization token JWT extrait de l'en-tête Authorization
     * @return liste des messages sous forme de DTO MesageResponse
     */
    @GetMapping("/contact/{contactId}")
    public ResponseEntity<List<MesageResponse>> getMessagesWithContact(
            @PathVariable UUID contactId,
            @RequestHeader("Authorization") String authorization) {
        String jwt = authorization.replace("Bearer ", "");
        List<MesageResponse> responses = messageService.getMessagesWithContact(contactId, jwt);
        return ResponseEntity.ok(responses);
    }

    /**
     * Récupère la liste des contacts (utilisateurs) avec qui l'utilisateur connecté a échangé des messages.
     *
     * @param authorization token JWT extrait de l'en-tête Authorization
     * @return liste des utilisateurs contacts sous forme d'objets User complets
     */
    @GetMapping("/contacts")
    public ResponseEntity<List<User>> getMyContacts(@RequestHeader("Authorization") String authorization) {
        String jwt = authorization.replace("Bearer ", "");
        List<String> contacts = messageService.getMyContacts(jwt);
        List<User> users = new ArrayList<>();
        for (String contact : contacts) {
            User user = userRepository.findByPseudo(contact)
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
            users.add(user);
        }
        return ResponseEntity.ok(users);
    }

    /**
     * Récupère un message spécifique par son UUID.
     *
     * @param authHeader token JWT extrait de l'en-tête Authorization
     * @param messageId UUID du message à récupérer
     * @return le message sous forme de DTO MesageResponse
     */
    @GetMapping("/{messageId}")
    public ResponseEntity<MesageResponse> getMessageById(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable UUID messageId) {
        MesageResponse response = messageService.getMessageById(messageId);
        return ResponseEntity.ok(response);
    }

    /**
     * Récupère uniquement les messages échangés entre l'utilisateur connecté et un contact donné.
     *
     * @param contactId UUID du contact
     * @param authorization token JWT extrait de l'en-tête Authorization
     * @return liste des messages échangés sous forme de DTO MesageResponse
     */
    @GetMapping("/me/contact/{contactId}")
    public ResponseEntity<List<MesageResponse>> getMyMessagesWithContact(
            @PathVariable UUID contactId,
            @RequestHeader("Authorization") String authorization) {
        String jwt = authorization.replace("Bearer ", "");
        List<MesageResponse> responses = messageService.getMyMessagesWithContact(contactId, jwt);
        return ResponseEntity.ok(responses);
    }
}
