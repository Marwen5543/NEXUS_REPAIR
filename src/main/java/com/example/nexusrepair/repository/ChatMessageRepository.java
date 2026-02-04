package com.example.nexusrepair.repository;

import com.example.nexusrepair.domain.ChatMessage;
import com.example.nexusrepair.domain.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    List<ChatMessage> findAllByRoomOrderByCreatedAtAsc(ChatRoom room);
}
