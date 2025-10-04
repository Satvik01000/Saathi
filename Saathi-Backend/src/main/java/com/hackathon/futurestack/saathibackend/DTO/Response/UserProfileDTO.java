package com.hackathon.futurestack.saathibackend.DTO.Response;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class UserProfileDTO {
    private UUID id;
    private String name;
    private String email;
    private List<ChatSummaryDTO> chats;
}