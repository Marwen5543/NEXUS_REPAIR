package com.example.nexusrepair.interface_;

import com.example.nexusrepair.dto.provider.*;

import java.util.List;
import java.util.UUID;

public interface ProviderService {
    List<ProviderResponse> findNearby(double lat, double lng, double radiusKm);
    void updateLocation(UUID providerUserId, UpdateProviderLocationRequest req);
}