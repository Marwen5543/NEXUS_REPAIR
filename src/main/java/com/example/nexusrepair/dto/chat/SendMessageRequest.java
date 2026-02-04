package com.example.nexusrepair.dto.chat;
import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public record SendMessageRequest(
        @NotBlank String content,
        UUID bookingId
) {}