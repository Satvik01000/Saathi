package com.hackathon.futurestack.saathibackend.Service.CerebrasTextToText;

import org.springframework.stereotype.Component;

@Component
public interface CerebrasTextToTextService {
    String textToTextResponse(String query);
}