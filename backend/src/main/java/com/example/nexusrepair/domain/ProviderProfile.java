package com.example.nexusrepair.domain;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="provider_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProviderProfile {

    @Id
    private UUID id; // same as userId

    @OneToOne(optional=false, fetch=FetchType.LAZY)
    @MapsId
    @JoinColumn(name="user_id")
    private User user;

    @Column(nullable=false, length=40)
    private String profession; // PLUMBER / ELECTRICIAN / etc

    @Column(nullable=false)
    private boolean available;

    @Column(columnDefinition = "geometry(Point, 4326)")
    private Point currentLocation;

    @Column(nullable=false)
    private Instant updatedAt;

    @PrePersist @PreUpdate
    void touch(){ updatedAt = Instant.now(); }
}
