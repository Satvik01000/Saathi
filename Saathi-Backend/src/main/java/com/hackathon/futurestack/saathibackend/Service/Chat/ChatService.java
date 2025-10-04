package com.hackathon.futurestack.saathibackend.Service.Chat;

import com.hackathon.futurestack.saathibackend.DTO.Response.ChatMessageResponseDTO;
import com.hackathon.futurestack.saathibackend.DTO.Response.NewChatResponseDTO;
import java.util.UUID;

public interface ChatService {
    NewChatResponseDTO createNewChat(String query);
    ChatMessageResponseDTO addMessageToChat(UUID chatId, String query);
}