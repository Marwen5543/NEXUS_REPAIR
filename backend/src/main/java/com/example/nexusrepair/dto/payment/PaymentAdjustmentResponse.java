package com.example.nexusrepair.dto.payment;

import com.example.nexusrepair.domain.enums.AdjustmentStatus;

import java.math.BigDecimal;
import java.util.UUID;

public record PaymentAdjustmentResponse(
        UUID id,
        UUID bookingId,
        BigDecimal amount,
        String reason,
        AdjustmentStatus status
) {}
