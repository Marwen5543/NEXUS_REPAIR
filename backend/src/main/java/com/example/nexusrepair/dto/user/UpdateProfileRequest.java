// com.example.nexusrepair.dto.user.UpdateProfileRequest
package com.example.nexusrepair.dto.user;

public record UpdateProfileRequest(
        String fullName,
        String phone,
        String whatsappNumber,
        String governorate,
        String city,
        String addressLine,
        String postalCode
) {
}