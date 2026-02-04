package com.example.nexusrepair.dto.booking;

import com.example.nexusrepair.domain.enums.BookingStatus;

import java.util.UUID;

public record BookingResponse(
        UUID bookingId,
        UUID clientId,
        UUID providerId,
        BookingStatus status,
        String address,
        double lat,
        double lng,
        String notes
) {}
