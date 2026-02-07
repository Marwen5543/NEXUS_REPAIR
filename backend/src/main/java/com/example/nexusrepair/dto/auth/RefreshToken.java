package com.example.nexusrepair.dto.auth;

import com.example.nexusrepair.domain.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="refresh_tokens",
        indexes = {
                @Index(name="ix_refresh_token_user", columnList="user_id"),
                @Index(name="ix_refresh_token_hash", columnList="tokenHash", unique = true)
        })
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RefreshToken {

    @Id @GeneratedValue
    private UUID id;

    @ManyToOne(optional=false, fetch=FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    // store hash only
    @Column(nullable=false, unique=true, length=255)
    private String tokenHash;

    @Column(nullable=false)
    private Instant issuedAt;

    @Column(nullable=false)
    private Instant expiresAt;

    private Instant revokedAt;

    @Column(length=120)
    private String deviceId;

    @Column(length=45)
    private String ipAddress;

    public boolean isActive(Instant now) {
        return revokedAt == null && expiresAt.isAfter(now);
    }
}
