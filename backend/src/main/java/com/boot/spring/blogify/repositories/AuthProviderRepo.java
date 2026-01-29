package com.boot.spring.blogify.repositories;

import com.boot.spring.blogify.entity.auth.AuthProvider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthProviderRepo extends JpaRepository<AuthProvider, Long> {

    Optional<AuthProvider> findAuthProviderByProviderName(String providerName);
}
