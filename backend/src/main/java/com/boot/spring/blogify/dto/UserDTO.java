package com.boot.spring.blogify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String name;
    private String photo;
    private String username;
    private String bio;
    private Long totalBlogs = 0L;
    private Long totalFollowers = 0L;
    private Long totalFollowings = 0L;
}
