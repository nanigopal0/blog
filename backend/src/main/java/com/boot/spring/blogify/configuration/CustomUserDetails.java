package com.boot.spring.blogify.configuration;

import com.boot.spring.blogify.dto.user.BaseUser;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;


@AllArgsConstructor
@Builder
public class CustomUserDetails implements UserDetails {
    // Always get not null user data for the fields id, name, username, role, userVerified
    private final transient BaseUser user;

    public Long getId() {
        return user.getId();
    }

    public boolean isUserVerified() {
        return user.isUserVerified();
    }

    public String getFullName() {
        return user.getName();
    }

    public String getUserName() {
        return user.getUsername();
    }

    public String getRole() {
        return user.getRole().name();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

}
