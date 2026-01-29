package com.boot.spring.blogify.dto;

import com.boot.spring.blogify.dto.user.UserOverviewDTO;

import java.time.LocalDateTime;


public record CommentDTO(
        Long commentId,
        UserOverviewDTO commenter,
        LocalDateTime commentedAt,
        String comment
) {
}
