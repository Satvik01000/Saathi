package com.hackathon.futurestack.saathibackend.Service.AIVoiceToVoice;
import com.hackathon.futurestack.saathibackend.DTO.Response.VoiceStepResponseDTO;
import org.springframework.web.multipart.MultipartFile;

public interface AIVoiceToVoiceService {
    VoiceStepResponseDTO stepByStepQueryResponse(MultipartFile audioQuery);
}