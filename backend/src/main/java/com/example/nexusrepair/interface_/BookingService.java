package com.example.nexusrepair.interface_;

import com.example.nexusrepair.dto.booking.*;

import java.util.List;
import java.util.UUID;

public interface BookingService {
    BookingResponse createBooking(UUID clientId, CreateBookingRequest req);
    BookingResponse assignProvider(UUID bookingId, AssignProviderRequest req);
    List<BookingResponse> myClientBookings(UUID clientId);
    List<BookingResponse> myProviderBookings(UUID providerId);
}