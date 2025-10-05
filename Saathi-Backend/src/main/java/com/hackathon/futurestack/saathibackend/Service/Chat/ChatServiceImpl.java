package com.hackathon.futurestack.saathibackend.Service.Chat;

import com.hackathon.futurestack.saathibackend.Config.AuthenticationFacade;
import com.hackathon.futurestack.saathibackend.DTO.Response.ChatMessageResponseDTO;
import com.hackathon.futurestack.saathibackend.DTO.Response.NewChatResponseDTO;
import com.hackathon.futurestack.saathibackend.DTO.Response.TextResponseDTO;
import com.hackathon.futurestack.saathibackend.Entities.*;
import com.hackathon.futurestack.saathibackend.Repository.ChatRepo;
import com.hackathon.futurestack.saathibackend.Repository.UserRepo;
import com.hackathon.futurestack.saathibackend.Service.AITextToText.AITextToTextService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatRepo chatRepo;
    private final UserRepo userRepo;
    private final AITextToTextService cerebrasService;
    private final AuthenticationFacade authFacade;

    public ChatServiceImpl(ChatRepo chatRepo, UserRepo userRepo, AITextToTextService cerebrasService, AuthenticationFacade authFacade) {
        this.chatRepo = chatRepo;
        this.userRepo = userRepo;
        this.cerebrasService = cerebrasService;
        this.authFacade = authFacade;
    }

    @Override
    @Transactional
    public NewChatResponseDTO createNewChat(String query) {
        User currentUser = findAuthenticatedUser();

        Chat newChat = new Chat();
        newChat.setUser(currentUser);
        newChat.setTitle(generateTitleFromQuery(query));

        Message userMessage = new Message(newChat, MessageSender.USER, query);
        newChat.getMessages().add(userMessage);

        List<Map<String, String>> messagesForApi = List.of(Map.of("role", "user", "content", query));
        TextResponseDTO aiResponse = cerebrasService.textToTextResponse(messagesForApi);

        Message modelMessage = new Message(newChat, MessageSender.MODEL, aiResponse.getContent());
        newChat.getMessages().add(modelMessage);

        Chat savedChat = chatRepo.save(newChat);

        return new NewChatResponseDTO(savedChat.getId(), aiResponse.getContent());
    }

    @Override
    @Transactional
    public ChatMessageResponseDTO addMessageToChat(UUID chatId, String query) {
        Chat chat = chatRepo.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found with ID: " + chatId));

        Message userMessage = new Message(chat, MessageSender.USER, query);
        chat.getMessages().add(userMessage);

        // ✅ FIX: The AI's role must be "assistant", not "model".
        List<Map<String, String>> messagesForApi = chat.getMessages().stream()
                .map(message -> {
                    String role = message.getSender() == MessageSender.USER ? "user" : "assistant";
                    return Map.of("role", role, "content", message.getContent());
                })
                .collect(Collectors.toList());

        TextResponseDTO aiResponse = cerebrasService.textToTextResponse(messagesForApi);

        Message modelMessage = new Message(chat, MessageSender.MODEL, aiResponse.getContent());
        chat.getMessages().add(modelMessage);

        chatRepo.save(chat);

        return new ChatMessageResponseDTO(aiResponse.getContent(), aiResponse.getModel());
    }

    @Override
    public Optional<List<Chat>> returnAllChat() {
        User currentUser = findAuthenticatedUser();
        return chatRepo.findByUser(currentUser);
    }

    @Override
    public Optional<Chat> findSingleChat(UUID chatId) {
        return chatRepo.findById(chatId);
    }

    private User findAuthenticatedUser() {
        Authentication authentication = authFacade.getAuthentication();
        String userFirebaseUid = authentication.getName();
        return userRepo.findByFirebaseUid(userFirebaseUid)
                .orElseThrow(() -> new RuntimeException("User not found with Firebase UID: " + userFirebaseUid));
    }

    private String generateTitleFromQuery(String query) {
        if (query == null || query.length() < 25) {
            return query;
        }
        return query.substring(0, 25) + "...";
    }
}