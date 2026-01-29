package com.boot.spring.blogify.repositories;

import com.boot.spring.blogify.entity.otp.OTP;
import com.boot.spring.blogify.entity.otp.Reason;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OTPRepository extends JpaRepository<OTP, Long> {
    Optional<OTP> findByUserIdAndReasonOrderByCreatedAtDesc(Long userId, Reason reason, Limit limit);

    void deleteByUserId(Long userId);
}
