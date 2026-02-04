package com.example.nexusrepair.dto.tracking;

import jakarta.validation.constraints.NotNull;

public record TrackingPointRequest(
        @NotNull Double lat,
        @NotNull Double lng,
        Double speedMps,
        Double headingDeg
) {}