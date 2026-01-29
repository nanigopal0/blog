package com.boot.spring.blogify.service.implementation;

import com.boot.spring.blogify.dto.blog.BlogReactionDTO;
import com.boot.spring.blogify.exception.BlogNotFoundException;
import com.boot.spring.blogify.repositories.BlogReactionRepo;
import com.boot.spring.blogify.service.BlogReactionService;
import com.boot.spring.blogify.util.GeneralMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BlogReactionServiceImpl implements BlogReactionService {

    private final BlogReactionRepo blogReactionRepo;


    public BlogReactionServiceImpl(BlogReactionRepo blogReactionRepo) {
        this.blogReactionRepo = blogReactionRepo;

    }

    @Override
    @Transactional
    public BlogReactionDTO like(Long blogId) {
        Long userId = GeneralMethod.findAuthenticatedUserId();
        blogReactionRepo.save(blogId, userId);
        return blogReactionRepo.findBlogReactionsById(blogId, userId).orElseThrow(() -> new BlogNotFoundException("Id: " + blogId + " not found"));
    }

    @Transactional
    @Override
    public BlogReactionDTO disLike(Long blogReactionId, Long blogId) {
        Long userId = GeneralMethod.findAuthenticatedUserId();
        blogReactionRepo.deleteById(blogReactionId);
        return blogReactionRepo.findBlogReactionsById(blogId, userId).orElseThrow(() -> new BlogNotFoundException("Id: " + blogId + " not found"));
    }

    @Transactional
    public void deleteAllBlogReactionsByUserId(Long userId) {
        blogReactionRepo.deleteAllByUserId(userId);
    }
}
