package com.hackathon.futurestack.saathibackend.Repository;

import com.hackathon.futurestack.saathibackend.Entities.Chat;
import com.hackathon.futurestack.saathibackend.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChatRepo extends JpaRepository<Chat, UUID> {
    Optional<List<Chat>> findByUser(User user);
}
