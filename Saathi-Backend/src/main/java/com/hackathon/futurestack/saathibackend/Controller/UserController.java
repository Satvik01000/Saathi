package com.hackathon.futurestack.saathibackend.Controller;

import com.hackathon.futurestack.saathibackend.Service.User.UserService;
import com.hackathon.futurestack.saathibackend.Entities.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/sync")
    public ResponseEntity<User> findOrCreateUser(Principal principal) {
        User user = userService.findOrCreateUser(principal.getName());
        return ResponseEntity.ok(user);
    }
}