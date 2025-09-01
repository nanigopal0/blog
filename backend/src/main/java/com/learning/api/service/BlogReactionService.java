package com.learning.api.service;

import com.learning.api.dto.BlogReactionRequestDTO;
import com.learning.api.dto.BlogReactionResponseDTO;

public interface BlogReactionService {
    BlogReactionResponseDTO like(BlogReactionRequestDTO blogLike);

    BlogReactionResponseDTO disLike(Long blogReactionId);

    public void deleteAllBlogReactionsByUserId(Long userId);
}
