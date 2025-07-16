package com.learning.api.configuration;

import com.learning.api.entity.BaseUser;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.bson.types.ObjectId;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;


@AllArgsConstructor
@Builder
public class CustomUserDetails implements UserDetails {
    private final transient BaseUser user;

    public ObjectId getId() {
        return user.getId();
    }

    public String getUserPhoto() {
        return user.getPhoto();
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
