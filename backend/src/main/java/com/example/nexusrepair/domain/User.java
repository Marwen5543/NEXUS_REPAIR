package com.example.nexusrepair.domain;

import com.example.nexusrepair.domain.enums.UserRole;
import com.example.nexusrepair.domain.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users",
        indexes = {
                @Index(name = "ix_users_email", columnList = "email", unique = true),
                @Index(name = "ix_users_phone", columnList = "phone", unique = true)
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ToString(exclude = {"passwordHash", "roles"})
public class User {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String passwordHash;

    @Column(length = 255)
    private String fullName;

    // ─── New Tunisian-relevant contact & location fields ───────────────────────
    @Column(length = 20, unique = true)
    private String phone;

    @Column(length = 20)
    private String whatsappNumber;

    @Column(length = 100)
    private String governorate;

    @Column(length = 150)
    private String city;

    @Column(length = 255)
    private String addressLine;

    @Column(length = 10)
    private String postalCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserStatus status;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id", nullable = false)
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    @Builder.Default
    private Set<UserRole> roles = new HashSet<>();

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.status == null) {
            this.status = UserStatus.ACTIVE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    // Optional helpers
    public boolean hasRole(UserRole role) {
        return roles.contains(role);
    }

    public boolean isActive() {
        return UserStatus.ACTIVE == status;
    }
}