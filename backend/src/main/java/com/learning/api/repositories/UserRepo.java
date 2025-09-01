package com.learning.api.repositories;

import com.learning.api.dto.UserOverviewDTO;
import com.learning.api.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepo extends JpaRepository<User, Long> {


    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);


    Page<UserOverviewDTO> findUsersByNameStartsWith(String name, Pageable pageable);
}
