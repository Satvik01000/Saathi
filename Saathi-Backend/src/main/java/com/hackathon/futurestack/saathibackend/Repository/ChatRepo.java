package com.hackathon.futurestack.saathibackend.Repository;

import com.hackathon.futurestack.saathibackend.Entities.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ChatRepo extends JpaRepository<Chat, UUID> {
}
