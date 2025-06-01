package com.example.demo.message;

import com.example.demo.user.User;
import com.example.demo.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/message")
public class MessageController {

    private final MessageService messageService;
    private final UserService userService;

    public MessageController(MessageService messageService, UserService userService) {
        this.messageService = messageService;
        this.userService = userService;
    }

    // Créer un message
    @PostMapping("/{userId}")
    public ResponseEntity<Message> createMessage(
                                                        @PathVariable UUID userId,
                                                        @RequestParam String content,
                                                        @RequestHeader("Authorization") String authorization) {
        User user = userService.getUserByJwt(authorization);

        return ResponseEntity.ok(messageService.createMessage(userId, content, user));
    }

    // Récupérer tous les messages avec un contact
    @GetMapping("/contact/{contactId}")
    public ResponseEntity<List<MesageResponse>> getMessagesWithContact(@PathVariable UUID contactId,
                                                                       @RequestHeader("Authorization") String authorization) {
        String jwt = authorization.replace("Bearer ", "");
        List<MesageResponse> responses = messageService.getMessagesWithContact(contactId, jwt);
        return ResponseEntity.ok(responses);
    }

    // Récupérer mes contacts (pseudos des personnes avec qui j'ai échangé)
    @GetMapping("/contacts")
    public ResponseEntity<List<String>> getMyContacts(@RequestHeader("Authorization") String authorization) {
        String jwt = authorization.replace("Bearer ", "");
        List<String> contacts = messageService.getMyContacts(jwt);
        return ResponseEntity.ok(contacts);
    }

    // Récupérer un message par ID
    @GetMapping("/{messageId}")
    public ResponseEntity<MesageResponse> getMessageById(@RequestHeader("Authorization") String authHeader,@PathVariable UUID messageId) {
        MesageResponse response = messageService.getMessageById(messageId);
        return ResponseEntity.ok(response);
    }

    // Récupérer uniquement mes messages échangés avec un contact
    @GetMapping("/me/contact/{contactId}")
    public ResponseEntity<List<MesageResponse>> getMyMessagesWithContact(@PathVariable UUID contactId,
                                                                         @RequestHeader("Authorization") String authorization) {
        String jwt = authorization.replace("Bearer ", "");
        List<MesageResponse> responses = messageService.getMyMessagesWithContact(contactId, jwt);
        return ResponseEntity.ok(responses);
    }
}

