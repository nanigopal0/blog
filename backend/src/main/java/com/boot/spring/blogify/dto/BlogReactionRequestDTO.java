package com.boot.spring.blogify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BlogReactionRequestDTO {
    private Long userId;
    private Long blogId;
}
