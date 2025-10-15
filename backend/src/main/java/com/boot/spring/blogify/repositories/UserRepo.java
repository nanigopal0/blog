package com.boot.spring.blogify.repositories;

import com.boot.spring.blogify.dto.UserOverviewDTO;
import com.boot.spring.blogify.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepo extends JpaRepository<User, Long> {


    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    Boolean existsUserByEmail(String email);

    Page<UserOverviewDTO> findUsersByNameStartsWith(String name, Pageable pageable);
}
