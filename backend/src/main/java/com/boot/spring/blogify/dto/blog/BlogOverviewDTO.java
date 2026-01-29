package com.boot.spring.blogify.dto.blog;

import java.time.LocalDateTime;


public record BlogOverviewDTO
        (
                Long id,
                String title,
                String coverImage,
                String content,
                LocalDateTime createdAt
        ) {

}
