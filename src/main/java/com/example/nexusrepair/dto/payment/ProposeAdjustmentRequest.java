package com.example.nexusrepair.dto.payment;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public record ProposeAdjustmentRequest(
        @NotNull UUID bookingId,
        @NotNull BigDecimal amount,
        @NotNull String reason,
        UUID sourceChatMessageId
) {}
