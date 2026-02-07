package com.example.nexusrepair.repository;

import com.example.nexusrepair.domain.Booking;
import com.example.nexusrepair.domain.PaymentAdjustment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PaymentAdjustmentRepository extends JpaRepository<PaymentAdjustment, UUID> {
    List<PaymentAdjustment> findAllByBooking(Booking booking);
}
