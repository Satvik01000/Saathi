package com.hackathon.futurestack.saathibackend.Controller;

import com.hackathon.futurestack.saathibackend.DTO.Request.ChatMessageRequestDTO;
import com.hackathon.futurestack.saathibackend.DTO.Response.NewChatResponseDTO;
import com.hackathon.futurestack.saathibackend.DTO.Response.ChatMessageResponseDTO;
import com.hackathon.futurestack.saathibackend.Service.Chat.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<NewChatResponseDTO> createNewChat(@Valid @RequestBody ChatMessageRequestDTO request) {
        NewChatResponseDTO response = chatService.createNewChat(request.getQuery());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{chatId}")
    public ResponseEntity<ChatMessageResponseDTO> addMessageToChat(@PathVariable UUID chatId, @Valid @RequestBody ChatMessageRequestDTO request) {
        ChatMessageResponseDTO response = chatService.addMessageToChat(chatId, request.getQuery());
        return ResponseEntity.ok(response);
    }
}