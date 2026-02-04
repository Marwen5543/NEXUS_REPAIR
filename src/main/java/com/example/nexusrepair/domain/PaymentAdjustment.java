package com.example.nexusrepair.domain;

import com.example.nexusrepair.domain.enums.AdjustmentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="payment_adjustments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentAdjustment {

    @Id @GeneratedValue
    private UUID id;

    @ManyToOne(optional=false, fetch=FetchType.LAZY)
    @JoinColumn(name="booking_id", nullable=false)
    private Booking booking;

    @Column(nullable=false, precision=12, scale=2)
    private BigDecimal amount;

    @Column(nullable=false, length=255)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false, length=30)
    private AdjustmentStatus status;

    private UUID sourceChatMessageId;

    @Column(nullable=false, updatable=false)
    private Instant createdAt;

    private Instant decidedAt;

    @PrePersist
    void prePersist(){
        createdAt = Instant.now();
        if(status == null) status = AdjustmentStatus.PROPOSED;
    }
}
