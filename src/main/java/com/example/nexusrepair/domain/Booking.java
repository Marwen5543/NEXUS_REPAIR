package com.example.nexusrepair.domain;

import com.example.nexusrepair.domain.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Booking {

    @Id @GeneratedValue
    private UUID id;

    @ManyToOne(optional=false, fetch=FetchType.LAZY)
    @JoinColumn(name="client_id", nullable=false)
    private User client;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="provider_id")
    private User provider;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false, length=30)
    private BookingStatus status;

    private Instant scheduledAt;

    @Column(length=1000)
    private String notes;

    @Column(nullable=false, updatable=false)
    private Instant createdAt;

    @Column(nullable=false)
    private Instant updatedAt;

    @PrePersist
    void prePersist(){
        createdAt = Instant.now();
        updatedAt = createdAt;
        if(status == null) status = BookingStatus.REQUESTED;
    }

    @PreUpdate
    void preUpdate(){ updatedAt = Instant.now(); }
}