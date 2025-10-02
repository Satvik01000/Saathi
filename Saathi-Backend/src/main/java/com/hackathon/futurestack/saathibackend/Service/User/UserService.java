package com.hackathon.futurestack.saathibackend.Service.User;

import com.hackathon.futurestack.saathibackend.Entities.User;
import org.springframework.stereotype.Component;

@Component
public interface UserService {
    User findOrCreateUser(String firebaseUid);
}
