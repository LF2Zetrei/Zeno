package com.example.demo.message;

import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import com.example.demo.user.UserService;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public MessageService(MessageRepository messageRepository,
                          UserRepository userRepository,
                          UserService userService) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    /**
     * Crée et sauvegarde un message envoyé par un utilisateur à un destinataire.
     *
     * @param recipientId UUID du destinataire
     * @param content contenu textuel du message
     * @param sender utilisateur qui envoie le message
     * @return le message persisté
     * @throws RuntimeException si le destinataire n'existe pas
     */
    public Message createMessage(UUID recipientId, String content, User sender) {
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Destinataire non trouvé"));

        Message message = new Message();
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setContent(content);
        message.setSentSince(ZonedDateTime.now());

        return messageRepository.save(message);
    }

    /**
     * Récupère tous les messages échangés entre l'utilisateur courant et un contact donné.
     * Inclut les messages envoyés et reçus.
     *
     * @param contactId UUID du contact
     * @param jwt token JWT permettant d'identifier l'utilisateur courant
     * @return liste des messages sous forme de DTO MesageResponse, triés par date d'envoi
     * @throws RuntimeException si le contact n'existe pas
     */
    public List<MesageResponse> getMessagesWithContact(UUID contactId, String jwt) {
        User currentUser = userService.getUserByJwt(jwt);
        User contact = userRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact non trouvé"));

        List<Message> messages = messageRepository.findBySenderAndRecipientOrRecipientAndSender(
                currentUser, contact, currentUser, contact);

        messages.sort(Comparator.comparing(Message::getSentSince));

        return messages.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Récupère la liste des pseudos des contacts avec qui l'utilisateur courant a échangé au moins un message.
     *
     * @param jwt token JWT de l'utilisateur courant
     * @return liste de pseudos des contacts distincts
     */
    public List<String> getMyContacts(String jwt) {
        User currentUser = userService.getUserByJwt(jwt);

        // Récupère tous les messages envoyés ou reçus par l'utilisateur
        List<Message> messages = messageRepository.findBySenderOrRecipient(currentUser, currentUser);

        // Récupère les pseudos distincts des contacts (excluant l'utilisateur lui-même)
        Set<String> contacts = new HashSet<>();
        for (Message m : messages) {
            if (!m.getSender().equals(currentUser)) {
                contacts.add(m.getSender().getPseudo());
            }
            if (!m.getRecipient().equals(currentUser)) {
                contacts.add(m.getRecipient().getPseudo());
            }
        }
        return new ArrayList<>(contacts);
    }

    /**
     * Récupère un message spécifique par son identifiant.
     *
     * @param messageId UUID du message à récupérer
     * @return le message sous forme de DTO MesageResponse
     * @throws RuntimeException si le message n'existe pas
     */
    public MesageResponse getMessageById(UUID messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message non trouvé"));
        return toResponse(message);
    }

    /**
     * Récupère les messages échangés entre l'utilisateur courant et un contact spécifique.
     * Cette méthode est une variante plus ciblée de getMessagesWithContact.
     *
     * @param contactId UUID du contact
     * @param jwt token JWT de l'utilisateur courant
     * @return liste des messages sous forme de DTO MesageResponse
     * @throws RuntimeException si le contact n'existe pas
     */
    public List<MesageResponse> getMyMessagesWithContact(UUID contactId, String jwt) {
        User currentUser = userService.getUserByJwt(jwt);
        User contact = userRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact non trouvé"));

        List<Message> messages = messageRepository.findBySenderAndRecipientOrRecipientAndSender(
                currentUser, contact, currentUser, contact);

        return messages.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convertit une entité Message en DTO MesageResponse.
     *
     * @param message message à convertir
     * @return DTO contenant uniquement les données nécessaires à la réponse
     */
    private MesageResponse toResponse(Message message) {
        MesageResponse response = new MesageResponse();
        response.setId(message.getIdMessage());
        response.setSenderPseudo(message.getSender().getPseudo());
        response.setRecipientPseudo(message.getRecipient().getPseudo());
        response.setContent(message.getContent());
        return response;
    }
}
