package com.example.nexusrepair.services;


import com.example.nexusrepair.domain.*;
import com.example.nexusrepair.domain.enums.BookingStatus;
import com.example.nexusrepair.dto.booking.*;
import com.example.nexusrepair.interface_.BookingService;
import com.example.nexusrepair.repository.*;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepo;
    private final BookingLocationRepository locationRepo;
    private final UserRepository userRepo;
    private final ChatRoomRepository chatRoomRepo;

    private final GeometryFactory gf = new GeometryFactory(new PrecisionModel(), 4326);

    @Override
    public BookingResponse createBooking(UUID clientId, CreateBookingRequest req) {
        User client = userRepo.findById(clientId).orElseThrow(() -> new RuntimeException("Client not found"));

        Booking booking = Booking.builder()
                .client(client)
                .status(BookingStatus.REQUESTED)
                .notes(req.notes())
                .build();

        booking = bookingRepo.save(booking);

        Point point = gf.createPoint(new Coordinate(req.lng(), req.lat()));
        BookingLocation loc = BookingLocation.builder()
                .booking(booking)
                .address(req.address())
                .servicePoint(point)
                .build();
        locationRepo.save(loc);

        // create chat room automatically for this booking
        ChatRoom room = ChatRoom.builder().booking(booking).build();
        chatRoomRepo.save(room);

        return toResponse(booking, loc);
    }

    @Override
    public BookingResponse assignProvider(UUID bookingId, AssignProviderRequest req) {
        Booking booking = bookingRepo.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));
        User provider = userRepo.findById(req.providerUserId()).orElseThrow(() -> new RuntimeException("Provider not found"));

        booking.setProvider(provider);
        booking.setStatus(BookingStatus.ASSIGNED);
        bookingRepo.save(booking);

        BookingLocation loc = locationRepo.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking location not found"));
        return toResponse(booking, loc);
    }

    @Override
    public List<BookingResponse> myClientBookings(UUID clientId) {
        User client = userRepo.findById(clientId).orElseThrow(() -> new RuntimeException("Client not found"));
        return bookingRepo.findAllByClient(client).stream().map(this::toResponse).toList();
    }

    @Override
    public List<BookingResponse> myProviderBookings(UUID providerId) {
        User provider = userRepo.findById(providerId).orElseThrow(() -> new RuntimeException("Provider not found"));
        return bookingRepo.findAllByProvider(provider).stream().map(this::toResponse).toList();
    }

    private BookingResponse toResponse(Booking b) {
        BookingLocation loc = locationRepo.findById(b.getId()).orElse(null);
        if (loc == null) {
            return new BookingResponse(b.getId(), b.getClient().getId(), b.getProvider() == null ? null : b.getProvider().getId(),
                    b.getStatus(), null, 0, 0, b.getNotes());
        }
        return toResponse(b, loc);
    }

    private BookingResponse toResponse(Booking b, BookingLocation loc) {
        double lat = loc.getServicePoint().getY();
        double lng = loc.getServicePoint().getX();
        return new BookingResponse(
                b.getId(),
                b.getClient().getId(),
                b.getProvider() == null ? null : b.getProvider().getId(),
                b.getStatus(),
                loc.getAddress(),
                lat,
                lng,
                b.getNotes()
        );
    }
}

