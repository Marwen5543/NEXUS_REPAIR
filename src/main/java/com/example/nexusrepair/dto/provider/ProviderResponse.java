package com.example.nexusrepair.dto.provider;

import java.util.UUID;

public record ProviderResponse(
        UUID userId,
        String profession,
        boolean available,
        double lat,
        double lng
) {}
