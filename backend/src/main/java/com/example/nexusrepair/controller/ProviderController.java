package com.example.nexusrepair.controller;


import com.example.nexusrepair.dto.provider.ProviderResponse;
import com.example.nexusrepair.dto.provider.UpdateProviderLocationRequest;
import com.example.nexusrepair.interface_.ProviderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/providers")
@RequiredArgsConstructor
public class ProviderController {

    private final ProviderService providerService;

    @GetMapping("/nearby")
    public List<ProviderResponse> nearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5") double radiusKm
    ) {
        return providerService.findNearby(lat, lng, radiusKm);
    }

    // Provider updates their own location
    @PostMapping("/me/location")
    public void updateMyLocation(Authentication auth, @Valid @RequestBody UpdateProviderLocationRequest req) {
        UUID providerId = UUID.fromString((String) auth.getPrincipal());
        providerService.updateLocation(providerId, req);
    }
}

