package com.example.nexusrepair.controller;

import com.example.nexusrepair.dto.user.ChangePasswordRequest;
import com.example.nexusrepair.dto.user.UpdateProfileRequest;
import com.example.nexusrepair.dto.user.UserProfileDTO;
import com.example.nexusrepair.interface_.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getProfile(
            @AuthenticationPrincipal String userId
    ) {
        UserProfileDTO profile = userService.getUserProfile(UUID.fromString(userId));
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        UserProfileDTO profile = userService.updateProfile(UUID.fromString(userId), request);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(UUID.fromString(userId), request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/account")
    public ResponseEntity<Void> deleteAccount(
            @AuthenticationPrincipal String userId
    ) {
        userService.deleteAccount(UUID.fromString(userId));
        return ResponseEntity.ok().build();
    }
}