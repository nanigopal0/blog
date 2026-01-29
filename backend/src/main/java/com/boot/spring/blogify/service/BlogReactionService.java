package com.boot.spring.blogify.service;

import com.boot.spring.blogify.dto.blog.BlogReactionDTO;
import com.boot.spring.blogify.dto.blog.BlogReactionRequestDTO;

public interface BlogReactionService {
    BlogReactionDTO like(Long blogId);

    BlogReactionDTO disLike(Long blogReactionId, Long blogId);

    void deleteAllBlogReactionsByUserId(Long userId);
}
