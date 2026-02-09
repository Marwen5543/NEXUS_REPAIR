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
        String phone,
        String whatsappNumber,
        String governorate,
        String city,
        String addressLine,
        String postalCode,
        UserStatus status,
        Set<UserRole> roles,
        Instant createdAt,
        Instant updatedAt
) {
}