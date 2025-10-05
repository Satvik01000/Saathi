package com.hackathon.futurestack.saathibackend.DTO.Response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class VoiceStepResponseDTO {
    private String transcribedText;
    private List<String> stepTexts;
    private List<byte[]> audioFiles;
}
