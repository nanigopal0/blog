package com.boot.spring.blogify.repositories;

import com.boot.spring.blogify.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepo extends JpaRepository<Admin, Long> {
    Optional<Admin> findByEmail(String email);

    Optional<Admin> findByUsername(String username);
}
