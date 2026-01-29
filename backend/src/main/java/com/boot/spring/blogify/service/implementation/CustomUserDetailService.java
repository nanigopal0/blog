package com.boot.spring.blogify.service.implementation;

import com.boot.spring.blogify.configuration.CustomUserDetails;
import com.boot.spring.blogify.dto.user.BaseUser;
import com.boot.spring.blogify.entity.user.Admin;
import com.boot.spring.blogify.entity.user.User;
import com.boot.spring.blogify.exception.UserNotFoundException;
import com.boot.spring.blogify.repositories.AdminRepo;
import com.boot.spring.blogify.repositories.UserRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailService implements UserDetailsService {


    private final UserRepo userRepo;
    private final AdminRepo adminRepo;

    public CustomUserDetailService(UserRepo userRepo, AdminRepo adminRepo) {
        this.userRepo = userRepo;
        this.adminRepo = adminRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        BaseUser baseUser;

        Optional<User> userOptional = userRepo.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            baseUser = new BaseUser(
                    user.getId(),
                    user.getName(),
                    user.getPhoto(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getPassword(),
                    user.getRole(),
                    user.isUserVerified()
            );
        } else {
            Admin admin = adminRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException(email));
            baseUser = new BaseUser(
                    admin.getId(),
                    admin.getName(),
                    admin.getPhoto(),
                    admin.getUsername(),
                    admin.getEmail(),
                    admin.getPassword(),
                    admin.getRole(),
                    admin.isUserVerified()
            );
        }

        return CustomUserDetails.builder()
                .user(baseUser)
                .build();
    }


}
