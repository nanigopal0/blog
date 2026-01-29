package com.boot.spring.blogify.repositories;

import com.boot.spring.blogify.dto.user.UserDTO;
import com.boot.spring.blogify.dto.user.UserOverviewDTO;
import com.boot.spring.blogify.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;


public interface UserRepo extends JpaRepository<User, Long> {


    Optional<User> findByEmail(String email);

    Boolean existsUserByEmail(String email);

    Optional<User> findByUsername(String username);

    @Query("""
            SELECT new com.boot.spring.blogify.dto.user.UserOverviewDTO(u.id,u.name,u.photo)
            FROM User u WHERE u.name LIKE :name%
            """)
    Page<UserOverviewDTO> findUsersByNameStartsWith(String name, Pageable pageable);

    @Query("""
                SELECT new com.boot.spring.blogify.dto.user.UserDTO(
                    u.id,u.name,u.photo,u.role ,u.userVerified,u.username,u.bio,u.defaultAuthMode.provider.providerName,
                    u.email,
                    (SELECT COUNT(b) FROM BlogData b WHERE b.user.id = :userId),
                    (SELECT COUNT(f1) FROM Follow f1 WHERE f1.followed.id = :userId),
                    (SELECT COUNT(f2) FROM Follow f2 WHERE f2.follower.id = :userId)
                ) FROM User u JOIN u.defaultAuthMode WHERE u.id = :userId
            """)
    UserDTO findCurrentUserById(Long userId);

}
