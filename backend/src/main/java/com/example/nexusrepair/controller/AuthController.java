package com.example.nexusrepair.controller;

import com.example.nexusrepair.dto.auth.*;
import com.example.nexusrepair.interface_.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signUp(
            @Valid @RequestBody SignUpRequest request,
            HttpServletRequest httpRequest
    ) {
        String deviceId = getDeviceId(httpRequest);
        String ip = getClientIp(httpRequest);

        AuthResponse response = authService.signUp(request, deviceId, ip);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signIn(
            @Valid @RequestBody SignInRequest request,
            HttpServletRequest httpRequest
    ) {
        String deviceId = getDeviceId(httpRequest);
        String ip = getClientIp(httpRequest);

        AuthResponse response = authService.signIn(request, deviceId, ip);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @Valid @RequestBody RefreshRequest request,
            HttpServletRequest httpRequest
    ) {
        String deviceId = getDeviceId(httpRequest);
        String ip = getClientIp(httpRequest);

        AuthResponse response = authService.refresh(request, deviceId, ip);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signout")
    public ResponseEntity<Void> signOut(@Valid @RequestBody SignOutRequest request) {
        authService.signOut(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/signout-all")
    public ResponseEntity<Void> signOutAll(@AuthenticationPrincipal String userId) {
        authService.signOutAll(UUID.fromString(userId));
        return ResponseEntity.ok().build();
    }

    /**
     * Extract device ID from request headers
     */
    private String getDeviceId(HttpServletRequest request) {
        String deviceId = request.getHeader("X-Device-Id");
        return deviceId != null ? deviceId : "unknown";
    }

    /**
     * Extract client IP address from request
     * Handles X-Forwarded-For header for proxied requests
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");

        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }

        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }

        // X-Forwarded-For can contain multiple IPs, take the first one
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }

        return ip != null ? ip : "unknown";
    }
}
