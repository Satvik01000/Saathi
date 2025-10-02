package com.hackathon.futurestack.saathibackend.Service.User;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.hackathon.futurestack.saathibackend.Entities.User;
import com.hackathon.futurestack.saathibackend.Repository.UserRepo;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;

    public UserServiceImpl(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public User findOrCreateUser(String firebaseUid) {
        return userRepo.findByFirebaseUid(firebaseUid).orElseGet(() -> {
            try {
                UserRecord userRecord = FirebaseAuth.getInstance().getUser(firebaseUid);
                User newUser = new User();
                newUser.setFirebaseUid(userRecord.getUid());
                newUser.setEmail(userRecord.getEmail());
                String name = userRecord.getDisplayName();
                if (name == null || name.isEmpty()) {
                    name = userRecord.getEmail();
                }
                newUser.setName(name);
                newUser.setRoles("ROLE_USER");
                return userRepo.save(newUser);
            } catch (FirebaseAuthException e) {
                throw new RuntimeException("Error fetching user data from Firebase or creating new user", e);
            }
        });
    }
}