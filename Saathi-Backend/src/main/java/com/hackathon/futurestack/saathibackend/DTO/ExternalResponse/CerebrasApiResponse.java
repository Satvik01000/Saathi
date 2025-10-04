package com.hackathon.futurestack.saathibackend.DTO.ExternalResponse;

import lombok.Data;

import java.util.List;

@Data
public class CerebrasApiResponse {
    private String id;
    private Long created;
    private String model;
    private Usage usage;
    private List<Choice> choices;

    @Data
    public static class Usage {
        private int promptTokens;
        private int completionTokens;
        private int totalTokens;
    }

    @Data
    public static class Choice {
        private int index;
        private String finishReason;
        private Message message;
    }

    @Data
    public static class Message {
        private String role;
        private String content;
    }
}
