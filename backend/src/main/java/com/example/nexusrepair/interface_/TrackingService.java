package com.example.nexusrepair.interface_;

import com.example.nexusrepair.dto.tracking.*;

import java.util.List;
import java.util.UUID;

public interface TrackingService {
    void pushPoint(UUID bookingId, UUID providerId, TrackingPointRequest req);
    List<TrackingPointResponse> latest(UUID bookingId);
}
