package com.boot.spring.blogify.util;

import com.boot.spring.blogify.dto.user.BasicUserInfo;
import com.boot.spring.blogify.entity.user.User;
import org.springframework.stereotype.Component;

@Component
public class EntityToDTO {

    public BasicUserInfo convertUserToBasicUserInfo(User user) {
        return new BasicUserInfo(
                user.getId(),
                user.getName(),
                user.getPhoto(),
                user.getRole().name(),
                user.isUserVerified(),
                user.getUsername(),
                user.getBio()
        );
    }


}
