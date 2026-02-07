package com.example.nexusrepair.dto.auth;

public record AuthResponse(
        String accessToken,
        String refreshToken
) {}