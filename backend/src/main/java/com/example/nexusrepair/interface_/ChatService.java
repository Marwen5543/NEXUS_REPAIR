package com.example.nexusrepair.interface_;

import com.example.nexusrepair.dto.chat.*;

import java.util.List;
import java.util.UUID;

public interface ChatService {
    ChatMessageResponse sendMessage(UUID bookingId, UUID senderId, SendMessageRequest req);
    List<ChatMessageResponse> history(UUID bookingId);
}
