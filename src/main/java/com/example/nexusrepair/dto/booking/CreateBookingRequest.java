package com.example.nexusrepair.dto.booking;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateBookingRequest(
        @NotBlank String address,
        @NotNull Double lat,
        @NotNull Double lng,
        String notes
) {}
