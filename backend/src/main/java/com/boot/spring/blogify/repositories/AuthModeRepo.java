package com.boot.spring.blogify.repositories;

import com.boot.spring.blogify.entity.auth.AuthMode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AuthModeRepo extends JpaRepository<AuthMode, Long> {

    List<AuthMode> findAuthModesByUser_Id(Long userId);

    Optional<AuthMode> findAuthModeByUserIdAndProviderId(Long userId, Integer providerId);
    void deleteAuthModesByUserId(Long userId);
}
