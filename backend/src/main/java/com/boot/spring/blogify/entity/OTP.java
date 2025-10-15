package com.boot.spring.blogify.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "OTP")
public class OTP {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,length = 6)
    private String otp;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean isVerified;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Reason reason;
}
