package com.example.nexusrepair.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="chat_rooms")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChatRoom {
    @Id @GeneratedValue
    private UUID id;

    @OneToOne(optional=false, fetch=FetchType.LAZY)
    @JoinColumn(name="booking_id", nullable=false, unique=true)
    private Booking booking;

    @Column(nullable=false, updatable=false)
    private Instant createdAt;

    @PrePersist void prePersist(){ createdAt = Instant.now(); }
}
