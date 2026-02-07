package com.example.nexusrepair.domain;

import com.example.nexusrepair.domain.enums.MessageType;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="chat_messages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChatMessage {

    @Id @GeneratedValue
    private UUID id;

    @ManyToOne(optional=false, fetch=FetchType.LAZY)
    @JoinColumn(name="room_id", nullable=false)
    private ChatRoom room;

    @ManyToOne(optional=false, fetch=FetchType.LAZY)
    @JoinColumn(name="sender_user_id", nullable=false)
    private User sender;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false, length=30)
    private MessageType type;

    @Column(nullable=false, length=2000)
    private String content;

    @Column(nullable=false, updatable=false)
    private Instant createdAt;

    @PrePersist
    void prePersist(){
        createdAt = Instant.now();
        if(type == null) type = MessageType.TEXT;
    }
}
