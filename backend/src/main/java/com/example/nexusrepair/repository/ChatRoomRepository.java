package com.example.nexusrepair.repository;

import com.example.nexusrepair.domain.ChatRoom;
import com.example.nexusrepair.domain.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, UUID> {
    Optional<ChatRoom> findByBooking(Booking booking);
}
