package com.example.nexusrepair.dto.payment;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public record CreatePaymentIntentRequest(
        @NotNull UUID bookingId,
        @NotNull BigDecimal baseAmount,
        String currency
) {}
