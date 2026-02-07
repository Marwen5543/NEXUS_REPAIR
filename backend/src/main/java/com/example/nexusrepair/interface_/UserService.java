package com.example.nexusrepair.interface_;

import com.example.nexusrepair.dto.user.ChangePasswordRequest;
import com.example.nexusrepair.dto.user.UpdateProfileRequest;
import com.example.nexusrepair.dto.user.UserProfileDTO;

import java.util.UUID;

public interface UserService {
    UserProfileDTO getUserProfile(UUID userId);
    UserProfileDTO updateProfile(UUID userId, UpdateProfileRequest request);
    void changePassword(UUID userId, ChangePasswordRequest request);
    void deleteAccount(UUID userId);
}