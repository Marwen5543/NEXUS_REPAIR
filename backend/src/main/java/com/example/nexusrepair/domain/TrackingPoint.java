package com.example.nexusrepair.domain;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="tracking_points")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TrackingPoint {

    @Id @GeneratedValue
    private UUID id;

    @ManyToOne(optional=false, fetch=FetchType.LAZY)
    @JoinColumn(name="booking_id", nullable=false)
    private Booking booking;

    @ManyToOne(optional=false, fetch=FetchType.LAZY)
    @JoinColumn(name="provider_user_id", nullable=false)
    private User provider;

    @Column(columnDefinition="geometry(Point, 4326)", nullable=false)
    private Point point;

    private Double speedMps;
    private Double headingDeg;

    @Column(nullable=false, updatable=false)
    private Instant createdAt;

    @PrePersist void prePersist(){ createdAt = Instant.now(); }
}
