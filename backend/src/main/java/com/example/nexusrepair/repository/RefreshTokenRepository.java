package com.example.nexusrepair.repository;

import com.example.nexusrepair.dto.auth.RefreshToken;
import com.example.nexusrepair.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByTokenHash(String tokenHash);
    List<RefreshToken> findAllByUser(User user);
}

