package com.hackathon.futurestack.saathibackend.Controller;

import com.hackathon.futurestack.saathibackend.DTO.Response.UserProfileDTO; // 1. Import the new DTO
import com.hackathon.futurestack.saathibackend.Entities.User;
import com.hackathon.futurestack.saathibackend.Mapper.UserMapper; // 2. Import the Mapper
import com.hackathon.futurestack.saathibackend.Service.User.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @PostMapping("/sync")
    public ResponseEntity<UserProfileDTO> findOrCreateUser(Principal principal) {
        User user = userService.findOrCreateUser(principal.getName());

        UserProfileDTO userProfileDTO = userMapper.toUserProfileDTO(user);

        return ResponseEntity.ok(userProfileDTO);
    }
}