package com.example.nexusrepair.services;


import com.example.nexusrepair.domain.Booking;
import com.example.nexusrepair.domain.PaymentAdjustment;
import com.example.nexusrepair.domain.PaymentIntent;
import com.example.nexusrepair.domain.enums.AdjustmentStatus;
import com.example.nexusrepair.domain.enums.PaymentStatus;
import com.example.nexusrepair.dto.payment.*;
import com.example.nexusrepair.interface_.PaymentService;
import com.example.nexusrepair.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final BookingRepository bookingRepo;
    private final PaymentIntentRepository intentRepo;
    private final PaymentAdjustmentRepository adjRepo;

    @Override
    public PaymentIntentResponse createIntent(CreatePaymentIntentRequest req) {
        Booking booking = bookingRepo.findById(req.bookingId()).orElseThrow(() -> new RuntimeException("Booking not found"));

        // prevent duplicates
        intentRepo.findByBooking(booking).ifPresent(x -> { throw new RuntimeException("Payment intent already exists"); });

        PaymentIntent intent = PaymentIntent.builder()
                .booking(booking)
                .baseAmount(req.baseAmount())
                .currency(req.currency() == null ? "USD" : req.currency())
                .status(PaymentStatus.DRAFT)
                .build();

        intent = intentRepo.save(intent);
        return toIntentResponse(intent);
    }

    @Override
    public PaymentAdjustmentResponse proposeAdjustment(ProposeAdjustmentRequest req) {
        Booking booking = bookingRepo.findById(req.bookingId()).orElseThrow(() -> new RuntimeException("Booking not found"));

        PaymentAdjustment adj = PaymentAdjustment.builder()
                .booking(booking)
                .amount(req.amount())
                .reason(req.reason())
                .status(AdjustmentStatus.PROPOSED)
                .sourceChatMessageId(req.sourceChatMessageId())
                .build();

        adj = adjRepo.save(adj);
        return toAdjResponse(adj);
    }

    @Override
    public PaymentAdjustmentResponse approveAdjustment(UUID adjustmentId) {
        PaymentAdjustment adj = adjRepo.findById(adjustmentId).orElseThrow(() -> new RuntimeException("Adjustment not found"));
        if (adj.getStatus() != AdjustmentStatus.PROPOSED) throw new RuntimeException("Adjustment is not PROPOSED");

        adj.setStatus(AdjustmentStatus.APPROVED);
        adj.setDecidedAt(Instant.now());
        adj = adjRepo.save(adj);

        return toAdjResponse(adj);
    }

    @Override
    public PaymentAdjustmentResponse rejectAdjustment(UUID adjustmentId) {
        PaymentAdjustment adj = adjRepo.findById(adjustmentId).orElseThrow(() -> new RuntimeException("Adjustment not found"));
        if (adj.getStatus() != AdjustmentStatus.PROPOSED) throw new RuntimeException("Adjustment is not PROPOSED");

        adj.setStatus(AdjustmentStatus.REJECTED);
        adj.setDecidedAt(Instant.now());
        adj = adjRepo.save(adj);

        return toAdjResponse(adj);
    }

    @Override
    public List<PaymentAdjustmentResponse> listAdjustments(UUID bookingId) {
        Booking booking = bookingRepo.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));
        return adjRepo.findAllByBooking(booking).stream().map(this::toAdjResponse).toList();
    }

    private PaymentIntentResponse toIntentResponse(PaymentIntent i) {
        return new PaymentIntentResponse(
                i.getId(),
                i.getBooking().getId(),
                i.getBaseAmount(),
                i.getCurrency(),
                i.getStatus()
        );
    }

    private PaymentAdjustmentResponse toAdjResponse(PaymentAdjustment a) {
        return new PaymentAdjustmentResponse(
                a.getId(),
                a.getBooking().getId(),
                a.getAmount(),
                a.getReason(),
                a.getStatus()
        );
    }
}
