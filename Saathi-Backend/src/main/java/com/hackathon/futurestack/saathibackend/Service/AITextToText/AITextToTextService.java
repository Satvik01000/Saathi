package com.hackathon.futurestack.saathibackend.Service.AITextToText;

import com.hackathon.futurestack.saathibackend.DTO.Response.TextResponseDTO;

import java.util.List;
import java.util.Map;

public interface AITextToTextService {
    TextResponseDTO textToTextResponse(List<Map<String, String>> messages);
}