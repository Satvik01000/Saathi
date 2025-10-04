package com.hackathon.futurestack.saathibackend.Controller;

import com.hackathon.futurestack.saathibackend.DTO.Request.TextRequestDTO;
import com.hackathon.futurestack.saathibackend.Service.CerebrasTextToText.CerebrasTextToTextService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class CerebrasController {
    private final CerebrasTextToTextService textToTextService;

    public CerebrasController(CerebrasTextToTextService cerebrasTextToTextService) {
        this.textToTextService = cerebrasTextToTextService;
    }

    @PostMapping("/text/complete")
    public String giveResponseText(@RequestBody TextRequestDTO textRequestDTO){
        return textToTextService.textToTextResponse(textRequestDTO.getQuery());
    }
}
