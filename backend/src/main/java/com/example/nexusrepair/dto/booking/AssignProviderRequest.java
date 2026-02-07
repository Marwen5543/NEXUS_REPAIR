package com.example.nexusrepair.dto.booking;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record AssignProviderRequest(@NotNull UUID providerUserId) {}
