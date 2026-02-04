package com.example.nexusrepair.controller;


import com.example.nexusrepair.dto.tracking.TrackingPointRequest;
import com.example.nexusrepair.dto.tracking.TrackingPointResponse;
import com.example.nexusrepair.interface_.TrackingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tracking")
@RequiredArgsConstructor
public class TrackingController {

    private final TrackingService trackingService;

    // provider pushes point for a booking
    @PostMapping("/booking/{bookingId}/push")
    public void push(Authentication auth, @PathVariable UUID bookingId, @Valid @RequestBody TrackingPointRequest req) {
        UUID providerId = UUID.fromString((String) auth.getPrincipal());
        trackingService.pushPoint(bookingId, providerId, req);
    }

    @GetMapping("/booking/{bookingId}/latest")
    public List<TrackingPointResponse> latest(@PathVariable UUID bookingId) {
        return trackingService.latest(bookingId);
    }
}
