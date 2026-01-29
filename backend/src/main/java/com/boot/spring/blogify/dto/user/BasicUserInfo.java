package com.boot.spring.blogify.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BasicUserInfo {

    private Long id;

    private String name;

    private String photo;

    private String role;

    private boolean userVerified;

    private String username;

    private String bio;
}
