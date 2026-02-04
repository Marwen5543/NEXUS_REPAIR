package com.example.nexusrepair.repository;

import com.example.nexusrepair.domain.Booking;
import com.example.nexusrepair.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findAllByClient(User client);
    List<Booking> findAllByProvider(User provider);
}
