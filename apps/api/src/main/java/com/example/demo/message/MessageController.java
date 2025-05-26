package com.example.demo.message;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/message")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    // Créer un message
    @PostMapping
    public ResponseEntity<MesageResponse> createMessage(@RequestBody MessageRequest request,
                                                        @RequestHeader("Authorization") String authorization) {
        String jwt = authorization.replace("Bearer ", "");
        MesageResponse response = messageService.createMessage(request, jwt);
        return ResponseEntity.ok(response);
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

