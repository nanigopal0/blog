package com.boot.spring.blogify.service.implementation;

import com.boot.spring.blogify.dto.BlogReactionRequestDTO;
import com.boot.spring.blogify.dto.BlogReactionResponseDTO;
import com.boot.spring.blogify.entity.BlogData;
import com.boot.spring.blogify.entity.BlogReaction;
import com.boot.spring.blogify.entity.User;
import com.boot.spring.blogify.exception.BlogNotFoundException;
import com.boot.spring.blogify.exception.UserNotFoundException;
import com.boot.spring.blogify.repositories.BlogReactionRepo;
import com.boot.spring.blogify.repositories.BlogRepo;
import com.boot.spring.blogify.repositories.UserRepo;
import com.boot.spring.blogify.service.BlogReactionService;
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
