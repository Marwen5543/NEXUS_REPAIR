package com.example.nexusrepair.services;

import com.example.nexusrepair.domain.User;
import com.example.nexusrepair.domain.enums.UserStatus;
import com.example.nexusrepair.dto.user.ChangePasswordRequest;
import com.example.nexusrepair.dto.user.UpdateProfileRequest;
import com.example.nexusrepair.dto.user.UserProfileDTO;
import com.example.nexusrepair.interface_.UserService;
import com.example.nexusrepair.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserProfileDTO getUserProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDTO(user);
    }

    @Override
    @Transactional
    public UserProfileDTO updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update only provided fields (null-safe)
        if (request.fullName() != null) {
            user.setFullName(request.fullName());
        }
        if (request.phone() != null) {
            user.setPhone(request.phone());
        }
        if (request.whatsappNumber() != null) {
            user.setWhatsappNumber(request.whatsappNumber());
        }
        if (request.governorate() != null) {
            user.setGovernorate(request.governorate());
        }
        if (request.city() != null) {
            user.setCity(request.city());
        }
        if (request.addressLine() != null) {
            user.setAddressLine(request.addressLine());
        }
        if (request.postalCode() != null) {
            user.setPostalCode(request.postalCode());
        }

        user = userRepository.save(user);
        return mapToDTO(user);
    }

    @Override
    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteAccount(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(UserStatus.DELETED);
        userRepository.save(user);
    }

    private UserProfileDTO mapToDTO(User user) {
        return new UserProfileDTO(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getWhatsappNumber(),
                user.getGovernorate(),
                user.getCity(),
                user.getAddressLine(),
                user.getPostalCode(),
                user.getStatus(),
                user.getRoles(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}