package com.hackathon.futurestack.saathibackend.Service.AIVoiceToVoice;

import com.hackathon.futurestack.saathibackend.DTO.Response.TextResponseDTO;
import com.hackathon.futurestack.saathibackend.DTO.Response.VoiceStepResponseDTO;
import com.hackathon.futurestack.saathibackend.Service.AITextToText.AITextToTextService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class AIVoiceToVoiceServiceImpl implements AIVoiceToVoiceService {

    @Value("${GROQ_API_KEY}")
    private String apiKey;

    @Value("${GROQ_STT_URL}")
    private String sttUrl;

    @Value("${GROQ_TTS_URL}")
    private String ttsUrl;

    private final WebClient webClient;
    private final AITextToTextService aiTextToTextService;

    public AIVoiceToVoiceServiceImpl(WebClient webClient, AITextToTextService aiTextToTextService) {
        this.webClient = webClient;
        this.aiTextToTextService = aiTextToTextService;
    }

    @Override
    public VoiceStepResponseDTO stepByStepQueryResponse(MultipartFile audioFile) {
        Map<String, Object> sttResponse = webClient.post()
                .uri(sttUrl)
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData("file", audioFile.getResource())
                        .with("model", "whisper-large-v3")
                        .with("temperature", "0")
                        .with("response_format", "json"))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

        String transcribedText = sttResponse != null && sttResponse.get("text") != null
                ? sttResponse.get("text").toString()
                : "";

        // ✅ FINAL PROMPT: Updated with instructions for simple language and specific app recommendations.
        String systemPrompt = "Your name is 'Saathi'. Your purpose is to help people, especially older adults, by providing simple, step-by-step guidance for digital tasks. " +
                "CRITICAL RULE: Avoid technical jargon. When a task requires an application, you MUST recommend and name the most common and widely-used application in India. " +
                "EXAMPLES: For email, recommend 'Gmail'. For payments, recommend 'Paytm' or 'Google Pay'. For messaging, recommend 'WhatsApp'. For booking trains, recommend 'IRCTC'." +
                " If the user's question is NOT about a specific digital task, you MUST politely refuse. Your response must be ONLY this exact sentence: 'I'm sorry, I'm designed specifically to help with tasks on your phone or computer, like paying electricity bills using PayTm or sending a UPI payment to a friend. General questions are outside of my scope.'" +
                " If the request IS a digital task, convert it into a concise, numbered list of executable steps. " +
                "Formatting Rules: " +
                "1) Output plain text only; no other text. " +
                "2) Start numbering at 1 and use the format '1. ...'. " +
                "3) Each step must be on a new line. " +
                "4) Respond in the same language as the user's request.";

        var messages = List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", transcribedText)
        );

        String rawSteps = aiTextToTextService.textToTextResponse(messages).getContent();

        List<String> stepList = Arrays.stream(rawSteps.split("\n"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        boolean isNonEnglish = containsNonEnglish(transcribedText);

        if (isNonEnglish) {
            return VoiceStepResponseDTO.builder()
                    .transcribedText(transcribedText)
                    .stepTexts(stepList)
                    .audioFiles(List.of())
                    .build();
        }

        List<byte[]> audioFiles = new ArrayList<>();
        for (String step : stepList) {
            byte[] audioBytes = webClient.post()
                    .uri(ttsUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of( "model", "tts-1", "voice", "alloy", "input", step, "response_format", "wav" ))
                    .retrieve()
                    .bodyToMono(byte[].class)
                    .block();

            if (audioBytes != null) audioFiles.add(audioBytes);
        }

        return VoiceStepResponseDTO.builder()
                .transcribedText(transcribedText)
                .stepTexts(stepList)
                .audioFiles(audioFiles)
                .build();
    }

    private boolean containsNonEnglish(String text) {
        if (text == null || text.isBlank()) return false;
        return text.codePoints().anyMatch(cp -> (cp >= 0x0900 && cp <= 0x0D7F) || (cp >= 0x4E00 && cp <= 0x9FFF));
    }
}