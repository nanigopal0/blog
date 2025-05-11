package com.learning.api.service;

import com.learning.api.entity.User;
import com.learning.api.repositories.UserRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepo userRepo;

    public CustomUserDetailService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        Optional<User> user = userRepo.findByEmail(email);

        if (user.isPresent()) {
            User userObj = user.get();

            return org.springframework.security.core.userdetails.User.builder()
                    .username(userObj.getEmail())
                    .password(userObj.getPassword())
                    .roles(getRoles(userObj)).build();
        } else throw new UsernameNotFoundException("Username Not found " + email);

    }


    private String[] getRoles(User user) {
        if (user.getRoles() == null) return new String[]{"USER"};
        else {
            return user.getRoles().split(",");
        }
    }
}
