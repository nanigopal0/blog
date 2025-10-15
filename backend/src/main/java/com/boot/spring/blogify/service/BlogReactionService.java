package com.boot.spring.blogify.service;

import com.boot.spring.blogify.dto.BlogReactionRequestDTO;
import com.boot.spring.blogify.dto.BlogReactionResponseDTO;

public interface BlogReactionService {
    BlogReactionResponseDTO like(BlogReactionRequestDTO blogLike);

    BlogReactionResponseDTO disLike(Long blogReactionId);

    public void deleteAllBlogReactionsByUserId(Long userId);
}
