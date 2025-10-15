package com.boot.spring.blogify.repositories;

import com.boot.spring.blogify.entity.OTP;
import com.boot.spring.blogify.entity.Reason;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OTPRepository extends JpaRepository<OTP, Long> {
    Optional<OTP> findByUserIdAndReasonOrderByCreatedAtDesc(Long userId, Reason reason, Limit limit);
}
