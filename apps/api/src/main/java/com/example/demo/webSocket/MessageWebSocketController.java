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

@Controller
public class MessageWebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @MessageMapping("/chat/{recipientId}")
    public void sendMessage(
            @DestinationVariable UUID recipientId,
            @Payload MessageDTO messageDto,
            @Header("Authorization") String jwtHeader
    ) {
        String jwt = jwtHeader.replace("Bearer ", "");
        User sender = userService.getUserByJwt(jwt);
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setContent(messageDto.getContent());
        message.setSentSince(ZonedDateTime.now());
        messageRepository.save(message);

        // Envoie au destinataire sur /user/{pseudo}/queue/messages
        messagingTemplate.convertAndSendToUser(
                recipient.getPseudo(),
                "/queue/messages",
                message
        );
        // Envoie aussi au sender
        messagingTemplate.convertAndSendToUser(
                sender.getPseudo(),
                "/queue/messages",
                message
        );
    }


}
