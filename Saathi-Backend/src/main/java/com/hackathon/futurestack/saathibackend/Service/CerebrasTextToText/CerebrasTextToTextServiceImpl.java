package com.hackathon.futurestack.saathibackend.Service.CerebrasTextToText;

import com.hackathon.futurestack.saathibackend.DTO.ExternalResponse.CerebrasApiResponse;
import com.hackathon.futurestack.saathibackend.DTO.Response.TextResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class CerebrasTextToTextServiceImpl implements CerebrasTextToTextService{
    @Value("${API_KEY}")
    private String apiKey;
    @Value("${API_URL}")
    private String apiUrl;

    private final WebClient webClient;
    public CerebrasTextToTextServiceImpl(WebClient webClient) {
        this.webClient = webClient;
    }

    @Override
    public TextResponseDTO textToTextResponse(List<Map<String, String>> messages) {
        Map<String, Object> requestBody = Map.of(
                "model", "llama-4-scout-17b-16e-instruct",
                "stream", false,
                "messages", messages,
                "temperature", 0,
                "max_tokens", -1,
                "seed", 0,
                "top_p", 1
        );

        CerebrasApiResponse response = webClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(CerebrasApiResponse.class)
                .block();

        assert response != null;
        return TextResponseDTO.builder()
                .content(response.getChoices().getFirst().getMessage().getContent())
                .model(response.getModel())
                .build();
    }

}