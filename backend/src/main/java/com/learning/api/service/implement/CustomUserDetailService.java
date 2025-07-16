package com.learning.api.service.implement;

import com.learning.api.configuration.CustomUserDetails;
import com.learning.api.entity.BaseUser;
import com.learning.api.entity.User;
import com.learning.api.exception.UserNotFoundException;
import com.learning.api.repositories.AdminRepo;
import com.learning.api.repositories.UserRepo;
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
