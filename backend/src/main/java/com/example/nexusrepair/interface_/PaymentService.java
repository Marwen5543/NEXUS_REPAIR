package com.example.nexusrepair.interface_;

import com.example.nexusrepair.dto.payment.*;

import java.util.List;
import java.util.UUID;

public interface PaymentService {
    PaymentIntentResponse createIntent(CreatePaymentIntentRequest req);
    PaymentAdjustmentResponse proposeAdjustment(ProposeAdjustmentRequest req);
    PaymentAdjustmentResponse approveAdjustment(UUID adjustmentId);
    PaymentAdjustmentResponse rejectAdjustment(UUID adjustmentId);
    List<PaymentAdjustmentResponse> listAdjustments(UUID bookingId);
}
