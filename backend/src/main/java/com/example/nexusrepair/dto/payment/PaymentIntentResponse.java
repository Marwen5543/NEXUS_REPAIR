package com.example.nexusrepair.dto.payment;

import com.example.nexusrepair.domain.enums.PaymentStatus;

import java.math.BigDecimal;
import java.util.UUID;

public record PaymentIntentResponse(
        UUID id,
        UUID bookingId,
        BigDecimal baseAmount,
        String currency,
        PaymentStatus status
) {}
