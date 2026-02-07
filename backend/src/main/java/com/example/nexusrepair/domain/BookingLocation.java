package com.example.nexusrepair.domain;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

import java.util.UUID;

@Entity
@Table(name="booking_locations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BookingLocation {

    @Id
    private UUID id;

    @OneToOne(optional=false, fetch=FetchType.LAZY)
    @MapsId
    @JoinColumn(name="booking_id")
    private Booking booking;

    @Column(nullable=false, length=255)
    private String address;

    @Column(columnDefinition="geometry(Point, 4326)", nullable=false)
    private Point servicePoint;
}
