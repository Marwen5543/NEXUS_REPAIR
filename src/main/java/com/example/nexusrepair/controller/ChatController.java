package com.example.nexusrepair.controller;


import com.example.nexusrepair.dto.chat.ChatMessageResponse;
import com.example.nexusrepair.dto.chat.SendMessageRequest;
import com.example.nexusrepair.interface_.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/booking/{bookingId}/history")
    public List<ChatMessageResponse> history(@PathVariable UUID bookingId) {
        return chatService.history(bookingId);
    }

    @PostMapping("/booking/{bookingId}/send")
    public ChatMessageResponse send(Authentication auth,
                                    @PathVariable UUID bookingId,
                                    @Valid @RequestBody SendMessageRequest req) {
        UUID senderId = UUID.fromString((String) auth.getPrincipal());
        return chatService.sendMessage(bookingId, senderId, req);
    }
}
