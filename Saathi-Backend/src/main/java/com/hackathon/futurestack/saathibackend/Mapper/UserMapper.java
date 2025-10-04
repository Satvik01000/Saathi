package com.hackathon.futurestack.saathibackend.Mapper;

import com.hackathon.futurestack.saathibackend.DTO.Response.ChatSummaryDTO;
import com.hackathon.futurestack.saathibackend.DTO.Response.UserProfileDTO;
import com.hackathon.futurestack.saathibackend.Entities.Chat;
import com.hackathon.futurestack.saathibackend.Entities.User;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UserMapper {
    public UserProfileDTO toUserProfileDTO(User user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setChats(user.getChats().stream()
                .map(this::toChatSummaryDTO)
                .collect(Collectors.toList()));
        return dto;
    }

    public ChatSummaryDTO toChatSummaryDTO(Chat chat) {
        ChatSummaryDTO dto = new ChatSummaryDTO();
        dto.setId(chat.getId());
        dto.setTitle(chat.getTitle());
        dto.setCreatedAt(chat.getCreatedAt());
        return dto;
    }
}