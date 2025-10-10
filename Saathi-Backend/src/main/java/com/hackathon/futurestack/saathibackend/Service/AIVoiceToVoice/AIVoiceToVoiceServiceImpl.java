package com.hackathon.futurestack.saathibackend.Service.AIVoiceToVoice;

import com.hackathon.futurestack.saathibackend.DTO.Response.VoiceStepResponseDTO;
import com.hackathon.futurestack.saathibackend.Service.AITextToText.AITextToTextService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class AIVoiceToVoiceServiceImpl implements AIVoiceToVoiceService {

    @Value("${GROQ_API_KEY}")
    private String apiKey;

    @Value("${GROQ_STT_URL}")
    private String sttUrl;

    private final WebClient webClient;
    private final AITextToTextService aiTextToTextService;

    public AIVoiceToVoiceServiceImpl(WebClient webClient, AITextToTextService aiTextToTextService) {
        this.webClient = webClient;
        this.aiTextToTextService = aiTextToTextService;
    }

    @Override
    public VoiceStepResponseDTO stepByStepQueryResponse(MultipartFile audioFile, String language) {
        Map<String, Object> sttResponse = webClient.post()
                .uri(sttUrl)
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData("file", audioFile.getResource())
                        .with("model", "whisper-large-v3")
                        .with("language", language) // ✅ Use the selected language
                        .with("temperature", "0")
                        .with("response_format", "json"))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

        String transcribedText = sttResponse != null && sttResponse.get("text") != null
                ? sttResponse.get("text").toString()
                : "";

        String systemPrompt = "Your name is 'Saathi'. Your purpose is to help people, especially older adults, navigate the digital world by providing simple, step-by-step guidance for tasks on phones or computers, such as paying an electricity bill using PayTm, sending a UPI payment to a friend, or sending an email." +
                " If a user's question is NOT about a specific digital task (e.g., general knowledge, trivia, small talk), you MUST politely refuse. Your response must be ONLY this exact sentence: 'I'm sorry, I'm designed specifically to help with tasks on your phone or computer, like paying electricity bills using PayTm or sending a UPI payment to a friend. General questions are outside of my scope.'" +
                " If the request IS about a digital task, you must convert it into a concise, numbered list of executable steps. " +
                "Formatting Rules: " +
                "1) Output plain text only; do not add any extra introductions, summaries, or conversational text. " +
                "2) Start numbering at 1 and use the format '1. ...'. " +
                "3) Each step must be on a new line. " +
                "4) Always respond in the same language as the user's request; do not translate. ";

        var messages = List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", transcribedText)
        );

        String rawSteps = aiTextToTextService.textToTextResponse(messages).getContent();

        List<String> stepList = Arrays.stream(rawSteps.split("\n"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        return VoiceStepResponseDTO.builder()
                .transcribedText(transcribedText)
                .stepTexts(stepList)
                .audioFiles(List.of())
                .build();
    }
}