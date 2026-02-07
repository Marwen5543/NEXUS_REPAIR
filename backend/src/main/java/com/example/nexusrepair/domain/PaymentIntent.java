package com.example.nexusrepair.domain;

import com.example.nexusrepair.domain.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="payment_intents")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentIntent {

    @Id @GeneratedValue
    private UUID id;

    @OneToOne(optional=false, fetch=FetchType.LAZY)
    @JoinColumn(name="booking_id", nullable=false, unique=true)
    private Booking booking;

    @Column(nullable=false, precision=12, scale=2)
    private BigDecimal baseAmount;

    @Column(nullable=false, length=3)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false, length=30)
    private PaymentStatus status;

    @Column(nullable=false, updatable=false)
    private Instant createdAt;

    @PrePersist
    void prePersist(){
        createdAt = Instant.now();
        if(status == null) status = PaymentStatus.DRAFT;
        if(currency == null) currency = "USD";
    }
}
