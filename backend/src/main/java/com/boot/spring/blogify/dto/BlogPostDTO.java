package com.boot.spring.blogify.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogPostDTO {
    private String title;
    private String content;
    private String coverImage;
    private Long categoryId;
    private Long userId;
}
