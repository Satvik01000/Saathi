package com.hackathon.futurestack.saathibackend.Service.CerebrasTextToText;

import com.hackathon.futurestack.saathibackend.DTO.Response.TextResponseDTO;
import org.springframework.stereotype.Component;

@Component
public interface CerebrasTextToTextService {
    TextResponseDTO textToTextResponse(String query);
}