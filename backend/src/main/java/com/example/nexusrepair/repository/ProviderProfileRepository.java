package com.example.nexusrepair.repository;

import com.example.nexusrepair.domain.ProviderProfile;
import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ProviderProfileRepository extends JpaRepository<ProviderProfile, UUID> {

    @Query("""
      SELECT p FROM ProviderProfile p
      WHERE p.available = true
        AND function('ST_DWithin', p.currentLocation, :center, :meters) = true
    """)
    List<ProviderProfile> findAvailableWithin(@Param("center") Point center, @Param("meters") double meters);
}
