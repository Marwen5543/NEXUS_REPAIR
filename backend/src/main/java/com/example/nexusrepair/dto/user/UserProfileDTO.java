package com.example.nexusrepair.dto.user;

import com.example.nexusrepair.domain.enums.UserRole;
import com.example.nexusrepair.domain.enums.UserStatus;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public record UserProfileDTO(
        UUID id,
        String email,
        String fullName,
        UserStatus status,
        Set<UserRole> roles,
        Instant createdAt,
        Instant updatedAt
) {}