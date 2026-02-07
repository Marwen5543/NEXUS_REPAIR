package com.example.nexusrepair.config;

import com.example.nexusrepair.domain.enums.UserRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class JwtService {

    private final SecretKey key;
    private final long accessTokenValidityMs;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-validity-ms:900000}") long accessTokenValidityMs // 15 minutes
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.accessTokenValidityMs = accessTokenValidityMs;
    }

    /**
     * Create access token with user details including fullName
     */
    public String createAccessToken(UUID userId, String email, String fullName, List<UserRole> roles) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + accessTokenValidityMs);

        return Jwts.builder()
                .subject(userId.toString())
                .claim("email", email)
                .claim("fullName", fullName) // ← ADD THIS
                .claim("roles", roles)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key, Jwts.SIG.HS512)
                .compact();
    }

    /**
     * Parse JWT token and get claims
     */
    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Extract user ID from token
     */
    public UUID extractUserId(String token) {
        return UUID.fromString(parseToken(token).getSubject());
    }

    /**
     * Extract email from token
     */
    public String extractEmail(String token) {
        return parseToken(token).get("email", String.class);
    }

    /**
     * Extract full name from token
     */
    public String extractFullName(String token) {
        return parseToken(token).get("fullName", String.class);
    }

    /**
     * Validate token
     */
    public boolean isTokenValid(String token) {
        try {
            parseToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}