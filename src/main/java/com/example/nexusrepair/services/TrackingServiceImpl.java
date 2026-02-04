package com.example.nexusrepair.services;


import com.example.nexusrepair.domain.Booking;
import com.example.nexusrepair.domain.TrackingPoint;
import com.example.nexusrepair.domain.User;
import com.example.nexusrepair.dto.tracking.TrackingPointRequest;
import com.example.nexusrepair.dto.tracking.TrackingPointResponse;
import com.example.nexusrepair.interface_.TrackingService;
import com.example.nexusrepair.repository.BookingRepository;
import com.example.nexusrepair.repository.TrackingPointRepository;
import com.example.nexusrepair.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TrackingServiceImpl implements TrackingService {

    private final BookingRepository bookingRepo;
    private final UserRepository userRepo;
    private final TrackingPointRepository trackingRepo;

    private final SimpMessagingTemplate messagingTemplate;

    private final GeometryFactory gf = new GeometryFactory(new PrecisionModel(), 4326);

    @Override
    public void pushPoint(UUID bookingId, UUID providerId, TrackingPointRequest req) {
        Booking booking = bookingRepo.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));
        User provider = userRepo.findById(providerId).orElseThrow(() -> new RuntimeException("Provider not found"));

        Point point = gf.createPoint(new Coordinate(req.lng(), req.lat()));

        TrackingPoint tp = TrackingPoint.builder()
                .booking(booking)
                .provider(provider)
                .point(point)
                .speedMps(req.speedMps())
                .headingDeg(req.headingDeg())
                .build();

        tp = trackingRepo.save(tp);

        TrackingPointResponse resp = new TrackingPointResponse(
                tp.getPoint().getY(),
                tp.getPoint().getX(),
                tp.getSpeedMps(),
                tp.getHeadingDeg(),
                tp.getCreatedAt()
        );

        messagingTemplate.convertAndSend("/topic/booking." + bookingId + ".gps", resp);
    }

    @Override
    public List<TrackingPointResponse> latest(UUID bookingId) {
        Booking booking = bookingRepo.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));

        // repository returns DESC, so reverse if you want ASC in frontend
        return trackingRepo.findTop50ByBookingOrderByCreatedAtDesc(booking).stream()
                .map(tp -> new TrackingPointResponse(
                        tp.getPoint().getY(),
                        tp.getPoint().getX(),
                        tp.getSpeedMps(),
                        tp.getHeadingDeg(),
                        tp.getCreatedAt()
                ))
                .toList();
    }
}

