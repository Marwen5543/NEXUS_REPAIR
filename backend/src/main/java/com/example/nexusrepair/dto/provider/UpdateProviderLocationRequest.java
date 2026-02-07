package com.example.nexusrepair.dto.provider;

import jakarta.validation.constraints.NotNull;

public record UpdateProviderLocationRequest(
        @NotNull Double lat,
        @NotNull Double lng,
        Double speedMps,
        Double headingDeg
) {}
