package com.hackathon.futurestack.saathibackend.Controller;

import com.hackathon.futurestack.saathibackend.DTO.Request.ChatMessageRequestDTO;
import com.hackathon.futurestack.saathibackend.DTO.Response.NewChatResponseDTO;
import com.hackathon.futurestack.saathibackend.DTO.Response.ChatMessageResponseDTO;
import com.hackathon.futurestack.saathibackend.DTO.Response.VoiceStepResponseDTO;
import com.hackathon.futurestack.saathibackend.Entities.Chat;
import com.hackathon.futurestack.saathibackend.Service.Chat.ChatService;
import com.hackathon.futurestack.saathibackend.Service.AIVoiceToVoice.AIVoiceToVoiceService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    private final ChatService chatService;
    private final AIVoiceToVoiceService aiVoiceToVoiceService;

    public ChatController(ChatService chatService, AIVoiceToVoiceService aiVoiceToVoiceService) {
        this.chatService = chatService;
        this.aiVoiceToVoiceService = aiVoiceToVoiceService;
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

    @GetMapping("/all")
    public ResponseEntity<Optional<List<Chat>>> allChats() {
        return ResponseEntity.ok(chatService.returnAllChat());
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<Optional<Chat>> getChatById(@PathVariable UUID chatId) {
        return ResponseEntity.ok(chatService.findSingleChat(chatId));
    }

    @PostMapping(value = "/voice", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VoiceStepResponseDTO> processVoiceQuery(
            @RequestPart("file") MultipartFile audioFile) {

        VoiceStepResponseDTO response = aiVoiceToVoiceService.stepByStepQueryResponse(audioFile);
        return ResponseEntity.ok(response);
    }
}