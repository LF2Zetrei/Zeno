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


    // Création d'un message
    public MesageResponse createMessage(MessageRequest request, String jwt) {
        User sender = userService.getUserByJwt(jwt);

        User recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new RuntimeException("Destinataire non trouvé"));

        Message message = new Message();
        message.setIdMessage(UUID.randomUUID());
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setContent(request.getContent());
        message.setSentSince(ZonedDateTime.now());

        messageRepository.save(message);
        return toResponse(message);
    }

    // Récupérer les messages échangés avec un contact donné (récupère aussi ceux envoyés par le contact)
    public List<MesageResponse> getMessagesWithContact(UUID contactId, String jwt) {
        User currentUser = userService.getUserByJwt(jwt);
        User contact = userRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact non trouvé"));

        List<Message> messages = messageRepository.findBySenderAndRecipientOrRecipientAndSender(
                currentUser, contact, currentUser, contact);

        messages.sort(Comparator.comparing(Message::getSentSince));

        return messages.stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Récupérer mes contacts : utilisateurs avec lesquels j'ai échangé au moins un message
    public List<String> getMyContacts(String jwt) {
        User currentUser = userService.getUserByJwt(jwt);

        // On récupère tous les messages envoyés ou reçus par l'utilisateur
        List<Message> messages = messageRepository.findBySenderOrRecipient(currentUser, currentUser);

        // On récupère les pseudos distincts des contacts (exclure soi-même)
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

    // Récupérer un message par son ID
    public MesageResponse getMessageById(UUID messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message non trouvé"));
        return toResponse(message);
    }

    // Récupérer mes messages envoyés ou reçus avec un contact (plus précis que getMessagesWithContact)
    public List<MesageResponse> getMyMessagesWithContact(UUID contactId, String jwt) {
        User currentUser = userService.getUserByJwt(jwt);
        User contact = userRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact non trouvé"));

        List<Message> messages = messageRepository.findBySenderAndRecipientOrRecipientAndSender(
                currentUser, contact, currentUser, contact);

        return messages.stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Conversion Message -> DTO MesageResponse
    private MesageResponse toResponse(Message message) {
        MesageResponse response = new MesageResponse();
        response.setId(message.getIdMessage());
        response.setSenderPseudo(message.getSender().getPseudo());
        response.setRecipientPseudo(message.getRecipient().getPseudo());
        response.setContent(message.getContent());
        return response;
    }
}
