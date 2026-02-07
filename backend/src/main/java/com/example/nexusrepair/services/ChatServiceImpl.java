package com.example.nexusrepair.services;


import com.example.nexusrepair.domain.*;
import com.example.nexusrepair.domain.enums.MessageType;
import com.example.nexusrepair.dto.chat.ChatMessageResponse;
import com.example.nexusrepair.dto.chat.SendMessageRequest;
import com.example.nexusrepair.interface_.ChatService;
import com.example.nexusrepair.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final BookingRepository bookingRepo;
    private final ChatRoomRepository roomRepo;
    private final ChatMessageRepository msgRepo;
    private final UserRepository userRepo;

    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public ChatMessageResponse sendMessage(UUID bookingId, UUID senderId, SendMessageRequest req) {
        Booking booking = bookingRepo.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));
        ChatRoom room = roomRepo.findByBooking(booking).orElseThrow(() -> new RuntimeException("Chat room not found"));
        User sender = userRepo.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found"));

        ChatMessage msg = ChatMessage.builder()
                .room(room)
                .sender(sender)
                .type(MessageType.TEXT)
                .content(req.content())
                .build();

        msg = msgRepo.save(msg);

        ChatMessageResponse response = toResponse(msg);

        // Broadcast to WebSocket subscribers
        messagingTemplate.convertAndSend("/topic/booking." + bookingId + ".chat", response);

        return response;
    }

    @Override
    public List<ChatMessageResponse> history(UUID bookingId) {
        Booking booking = bookingRepo.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));
        ChatRoom room = roomRepo.findByBooking(booking).orElseThrow(() -> new RuntimeException("Chat room not found"));

        return msgRepo.findAllByRoomOrderByCreatedAtAsc(room).stream()
                .map(this::toResponse)
                .toList();
    }

    private ChatMessageResponse toResponse(ChatMessage m) {
        return new ChatMessageResponse(
                m.getId(),
                m.getSender().getId(),
                m.getType(),
                m.getContent(),
                m.getCreatedAt()
        );
    }
}

