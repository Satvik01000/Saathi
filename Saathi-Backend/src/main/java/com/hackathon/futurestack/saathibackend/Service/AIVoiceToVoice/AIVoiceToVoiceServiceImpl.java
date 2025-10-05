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
                        .with("model", "whisper-large-v3-turbo")
                        .with("temperature", "0")
                        .with("response_format", "json"))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

        String transcribedText = sttResponse != null && sttResponse.get("text") != null
                ? sttResponse.get("text").toString()
                : "";

        String systemPrompt = "Convert the user's request into a concise, numbered list of executable steps. " +
        "Rules: " +
        "1) Output plain text only; no introductions or summaries. " +
        "2) Start numbering at 1 and increment by 1 using the format '1. ...'. " +
        "3) Put each step on its own line with no blank lines. " +
        "4) Preserve the input language; do not translate; respond in the same language as the user's input. " +
        "5) If the request is ambiguous, first include a step to ask a clarifying question. " +
        "6) If multiple tasks exist, order steps logically and keep each step atomic. " +
        "Return only the steps.";

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
                    .audioFiles(List.of()) // empty list signals frontend to use fallback
                    .build();
        }

        List<byte[]> audioFiles = new ArrayList<>();
        for (String step : stepList) {
            byte[] audioBytes = webClient.post()
                    .uri(ttsUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of(
                            "model", "playai-tts",
                            "voice", "Aaliyah-PlayAI",
                            "input", step,
                            "response_format", "wav"
                    ))
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

        return text.codePoints().anyMatch(cp ->
                (cp >= 0x0900 && cp <= 0x097F) ||  // Devanagari (Hindi)
                        (cp >= 0x0980 && cp <= 0x09FF) ||  // Bengali
                        (cp >= 0x0B80 && cp <= 0x0BFF) ||  // Tamil
                        (cp >= 0x0C00 && cp <= 0x0C7F)     // Telugu, Kannada, etc.
        );
    }
}
