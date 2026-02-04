package com.example.nexusrepair.controller;


import com.example.nexusrepair.dto.payment.*;
import com.example.nexusrepair.interface_.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/intent")
    public PaymentIntentResponse createIntent(@Valid @RequestBody CreatePaymentIntentRequest req) {
        return paymentService.createIntent(req);
    }

    @PostMapping("/adjustments/propose")
    public PaymentAdjustmentResponse propose(@Valid @RequestBody ProposeAdjustmentRequest req) {
        return paymentService.proposeAdjustment(req);
    }

    @PostMapping("/adjustments/{adjustmentId}/approve")
    public PaymentAdjustmentResponse approve(@PathVariable UUID adjustmentId) {
        return paymentService.approveAdjustment(adjustmentId);
    }

    @PostMapping("/adjustments/{adjustmentId}/reject")
    public PaymentAdjustmentResponse reject(@PathVariable UUID adjustmentId) {
        return paymentService.rejectAdjustment(adjustmentId);
    }

    @GetMapping("/booking/{bookingId}/adjustments")
    public List<PaymentAdjustmentResponse> list(@PathVariable UUID bookingId) {
        return paymentService.listAdjustments(bookingId);
    }
}

