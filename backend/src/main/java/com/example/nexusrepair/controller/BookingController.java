package com.example.nexusrepair.controller;


import com.example.nexusrepair.dto.booking.*;
import com.example.nexusrepair.interface_.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // Client creates booking
    @PostMapping
    public BookingResponse create(Authentication auth, @Valid @RequestBody CreateBookingRequest req) {
        UUID clientId = UUID.fromString((String) auth.getPrincipal());
        return bookingService.createBooking(clientId, req);
    }

    // Admin/Dispatcher assigns provider
    @PostMapping("/{bookingId}/assign")
    public BookingResponse assign(@PathVariable UUID bookingId, @Valid @RequestBody AssignProviderRequest req) {
        return bookingService.assignProvider(bookingId, req);
    }

    @GetMapping("/me/client")
    public List<BookingResponse> myClientBookings(Authentication auth) {
        UUID clientId = UUID.fromString((String) auth.getPrincipal());
        return bookingService.myClientBookings(clientId);
    }

    @GetMapping("/me/provider")
    public List<BookingResponse> myProviderBookings(Authentication auth) {
        UUID providerId = UUID.fromString((String) auth.getPrincipal());
        return bookingService.myProviderBookings(providerId);
    }
}

