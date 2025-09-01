package com.learning.api.service.implement;

import com.learning.api.dto.BlogReactionRequestDTO;
import com.learning.api.dto.BlogReactionResponseDTO;
import com.learning.api.entity.BlogData;
import com.learning.api.entity.BlogReaction;
import com.learning.api.entity.User;
import com.learning.api.exception.BlogNotFoundException;
import com.learning.api.exception.UserNotFoundException;
import com.learning.api.repositories.BlogReactionRepo;
import com.learning.api.repositories.BlogRepo;
import com.learning.api.repositories.UserRepo;
import com.learning.api.service.BlogReactionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
public class BlogReactionServiceImpl implements BlogReactionService {

    private final BlogReactionRepo blogReactionRepo;
    private final BlogRepo blogRepo;
    private final UserRepo userRepo;

    public BlogReactionServiceImpl(BlogReactionRepo blogReactionRepo, BlogRepo blogRepo, UserRepo userRepo) {
        this.blogReactionRepo = blogReactionRepo;
        this.blogRepo = blogRepo;
        this.userRepo = userRepo;
    }

    @Override
    public BlogReactionResponseDTO like(BlogReactionRequestDTO blogLike) {
        BlogData blog = blogRepo.findById(blogLike.getBlogId()).orElseThrow(() ->
                new BlogNotFoundException("Invalid blog ID: " + blogLike.getBlogId()));
        User user = userRepo.findById(blogLike.getUserId()).orElseThrow(() ->
                new UserNotFoundException("Invalid user ID: " + blogLike.getUserId()));
        BlogReaction blogReaction = BlogReaction.builder().blog(blog).user(user).build();
        BlogReaction saved = blogReactionRepo.save(blogReaction);
        return BlogReactionResponseDTO.builder()
                .reactionId(saved.getId())
                .totalLikes(countTotalLikes(saved.getBlog().getId()))
                .build();
    }

    public Long countTotalLikes(Long blogId) {
        return blogReactionRepo.countBlogReactionsByBlogId(blogId);
    }

    @Transactional
    @Override
    public BlogReactionResponseDTO disLike(Long blogReactionId) {
        BlogReaction blogReaction = blogReactionRepo.findById(blogReactionId).orElseThrow(() -> new NoSuchElementException("Invalid blog reaction ID"));
        blogReactionRepo.deleteById(blogReactionId);
        return BlogReactionResponseDTO.builder().totalLikes(countTotalLikes(blogReaction.getBlog().getId())).build();
    }

    public void deleteAllBlogReactionsByUserId(Long userId) {
        blogReactionRepo.deleteAllByUserId(userId);
    }
}
