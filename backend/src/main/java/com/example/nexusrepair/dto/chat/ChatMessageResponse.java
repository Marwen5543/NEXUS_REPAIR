package com.example.nexusrepair.dto.chat;

import com.example.nexusrepair.domain.enums.MessageType;

import java.time.Instant;
import java.util.UUID;

public record ChatMessageResponse(
        UUID id,
        UUID senderId,
        MessageType type,
        String content,
        Instant createdAt
) {}
