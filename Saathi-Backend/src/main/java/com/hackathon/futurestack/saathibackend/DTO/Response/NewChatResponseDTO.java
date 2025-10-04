package com.hackathon.futurestack.saathibackend.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class NewChatResponseDTO {
    private UUID chatId; // The ID for the new chat session
    private String modelResponse; // The AI's first message
}