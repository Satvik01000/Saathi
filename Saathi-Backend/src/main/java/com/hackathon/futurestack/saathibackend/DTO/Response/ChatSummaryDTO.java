package com.hackathon.futurestack.saathibackend.DTO.Response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ChatSummaryDTO {
    private UUID id;
    private String title;
    private LocalDateTime createdAt;
}