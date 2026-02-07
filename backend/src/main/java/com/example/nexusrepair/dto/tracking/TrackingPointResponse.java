package com.example.nexusrepair.dto.tracking;


import java.time.Instant;

public record TrackingPointResponse(
        double lat,
        double lng,
        Double speedMps,
        Double headingDeg,
        Instant createdAt
) {}