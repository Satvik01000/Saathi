package com.hackathon.futurestack.saathibackend.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatMessageResponseDTO {
    private String modelResponse;
    private String model;
}