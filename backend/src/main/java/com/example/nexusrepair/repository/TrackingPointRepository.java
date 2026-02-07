package com.example.nexusrepair.repository;

import com.example.nexusrepair.domain.Booking;
import com.example.nexusrepair.domain.TrackingPoint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TrackingPointRepository extends JpaRepository<TrackingPoint, UUID> {
    List<TrackingPoint> findTop50ByBookingOrderByCreatedAtDesc(Booking booking);
}