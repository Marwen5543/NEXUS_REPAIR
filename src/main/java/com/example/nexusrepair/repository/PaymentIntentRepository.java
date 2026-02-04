package com.example.nexusrepair.repository;

import com.example.nexusrepair.domain.Booking;
import com.example.nexusrepair.domain.PaymentIntent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PaymentIntentRepository extends JpaRepository<PaymentIntent, UUID> {
    Optional<PaymentIntent> findByBooking(Booking booking);
}