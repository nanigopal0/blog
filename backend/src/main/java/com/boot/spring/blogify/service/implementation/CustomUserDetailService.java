package com.boot.spring.blogify.service.implementation;

import com.boot.spring.blogify.configuration.CustomUserDetails;
import com.boot.spring.blogify.entity.BaseUser;
import com.boot.spring.blogify.entity.User;
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
        BaseUser user;
        Optional<User> userOptional = userRepo.findByEmail(email);
        if (userOptional.isPresent()) user = userOptional.get();
        else user = adminRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException(email));

        return CustomUserDetails.builder()
                .user(user)
                .build();
    }


}
