package com.example.nexusrepair.services;

import com.example.nexusrepair.config.JwtService;
import com.example.nexusrepair.config.TokenHash;
import com.example.nexusrepair.domain.*;
import com.example.nexusrepair.domain.enums.UserRole;
import com.example.nexusrepair.domain.enums.UserStatus;
import com.example.nexusrepair.dto.auth.*;
import com.example.nexusrepair.interface_.AuthService;
import com.example.nexusrepair.repository.RefreshTokenRepository;
import com.example.nexusrepair.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepo;
    private final RefreshTokenRepository refreshRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private static final SecureRandom RNG = new SecureRandom();
    private static final long REFRESH_DAYS = 30;

    @Override
    public AuthResponse signUp(SignUpRequest req, String deviceId, String ip) {
        if (userRepo.existsByEmail(req.email().toLowerCase())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .email(req.email().toLowerCase())
                .passwordHash(passwordEncoder.encode(req.password()))
                .fullName(req.fullName()) // ← ADD THIS
                .status(UserStatus.ACTIVE)
                .roles(Set.of(UserRole.CLIENT))
                .build();

        user = userRepo.save(user);
        return issueTokens(user, deviceId, ip);
    }

    @Override
    public AuthResponse signIn(SignInRequest req, String deviceId, String ip) {
        User user = userRepo.findByEmail(req.email().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("User not active");
        }

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        return issueTokens(user, deviceId, ip);
    }

    @Override
    public AuthResponse refresh(RefreshRequest req, String deviceId, String ip) {
        String hash = TokenHash.sha256Base64(req.refreshToken());
        RefreshToken token = refreshRepo.findByTokenHash(hash)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        Instant now = Instant.now();
        if (!token.isActive(now)) {
            throw new RuntimeException("Refresh token expired/revoked");
        }

        token.setRevokedAt(now);
        refreshRepo.save(token);

        User user = token.getUser();
        return issueTokens(user, deviceId, ip);
    }

    @Override
    public void signOut(SignOutRequest req) {
        String hash = TokenHash.sha256Base64(req.refreshToken());
        RefreshToken token = refreshRepo.findByTokenHash(hash)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        token.setRevokedAt(Instant.now());
        refreshRepo.save(token);
    }

    @Override
    public void signOutAll(UUID userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Instant now = Instant.now();
        var tokens = refreshRepo.findAllByUser(user);
        tokens.forEach(t -> {
            if (t.getRevokedAt() == null) {
                t.setRevokedAt(now);
            }
        });
        refreshRepo.saveAll(tokens);
    }

    private AuthResponse issueTokens(User user, String deviceId, String ip) {
        String access = jwtService.createAccessToken(
                user.getId(),
                user.getEmail(),
                user.getFullName(), // ← ADD THIS
                user.getRoles().stream().toList()
        );

        String refreshRaw = generateRefreshToken();
        String refreshHash = TokenHash.sha256Base64(refreshRaw);

        Instant now = Instant.now();
        RefreshToken refresh = RefreshToken.builder()
                .user(user)
                .tokenHash(refreshHash)
                .issuedAt(now)
                .expiresAt(now.plus(REFRESH_DAYS, ChronoUnit.DAYS))
                .deviceId(deviceId)
                .ipAddress(ip)
                .build();

        refreshRepo.save(refresh);

        return new AuthResponse(access, refreshRaw);
    }

    private String generateRefreshToken() {
        byte[] bytes = new byte[64];
        RNG.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}