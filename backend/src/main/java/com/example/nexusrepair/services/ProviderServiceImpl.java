package com.example.nexusrepair.services;

import com.example.nexusrepair.domain.ProviderProfile;
import com.example.nexusrepair.domain.User;
import com.example.nexusrepair.dto.provider.ProviderResponse;
import com.example.nexusrepair.dto.provider.UpdateProviderLocationRequest;
import com.example.nexusrepair.interface_.ProviderService;
import com.example.nexusrepair.repository.ProviderProfileRepository;
import com.example.nexusrepair.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProviderServiceImpl implements ProviderService {

    private final ProviderProfileRepository providerRepo;
    private final UserRepository userRepo;

    private final GeometryFactory gf = new GeometryFactory(new PrecisionModel(), 4326);

    @Override
    public List<ProviderResponse> findNearby(double lat, double lng, double radiusKm) {
        Point center = gf.createPoint(new Coordinate(lng, lat));
        double meters = radiusKm * 1000.0;

        return providerRepo.findAvailableWithin(center, meters)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void updateLocation(UUID providerUserId, UpdateProviderLocationRequest req) {
        ProviderProfile profile = providerRepo.findById(providerUserId)
                .orElseThrow(() -> new RuntimeException("Provider profile not found"));

        Point p = gf.createPoint(new Coordinate(req.lng(), req.lat()));
        profile.setCurrentLocation(p);
        providerRepo.save(profile);

        // Optional: persist into tracking feed in TrackingService (not here)
    }

    private ProviderResponse toResponse(ProviderProfile p) {
        double lat = p.getCurrentLocation() == null ? 0 : p.getCurrentLocation().getY();
        double lng = p.getCurrentLocation() == null ? 0 : p.getCurrentLocation().getX();
        return new ProviderResponse(
                p.getUser().getId(),
                p.getProfession(),
                p.isAvailable(),
                lat,
                lng
        );
    }
}
