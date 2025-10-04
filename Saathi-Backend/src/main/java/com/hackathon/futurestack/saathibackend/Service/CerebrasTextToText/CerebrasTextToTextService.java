package com.hackathon.futurestack.saathibackend.Service.CerebrasTextToText;

import com.hackathon.futurestack.saathibackend.DTO.Response.TextResponseDTO;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Map;

public interface CerebrasTextToTextService {
    TextResponseDTO textToTextResponse(List<Map<String, String>> messages);
}