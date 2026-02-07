package com.example.nexusrepair.interface_;

import com.example.nexusrepair.dto.auth.*;

import java.util.UUID;

public interface AuthService {
    AuthResponse signUp(SignUpRequest req, String deviceId, String ip);
    AuthResponse signIn(SignInRequest req, String deviceId, String ip);
    AuthResponse refresh(RefreshRequest req, String deviceId, String ip);
    void signOut(SignOutRequest req);
    void signOutAll(UUID userId);
}
