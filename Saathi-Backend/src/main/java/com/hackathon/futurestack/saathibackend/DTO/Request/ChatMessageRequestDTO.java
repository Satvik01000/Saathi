package com.hackathon.futurestack.saathibackend.DTO.Request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class ChatMessageRequestDTO {
    @NotBlank(message = "Query cannot be empty")
    String query;
}
