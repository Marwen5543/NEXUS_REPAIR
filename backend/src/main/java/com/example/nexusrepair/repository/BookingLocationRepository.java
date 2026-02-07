package com.example.nexusrepair.repository;

import com.example.nexusrepair.domain.BookingLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BookingLocationRepository extends JpaRepository<BookingLocation, UUID> {}

