package com.learning.api.service.implement;

import com.learning.api.dto.BlogReactionRequestDTO;
import com.learning.api.entity.BlogReaction;
import com.learning.api.repositories.BlogReactionRepo;
import com.learning.api.service.BlogReactionService;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
public class BlogReactionServiceImpl implements BlogReactionService {

    private final BlogReactionRepo blogReactionRepo;

    public BlogReactionServiceImpl(BlogReactionRepo blogReactionRepo) {
        this.blogReactionRepo = blogReactionRepo;
    }

    @Override
    public String like(BlogReactionRequestDTO blogLike) {
        BlogReaction blogReaction = BlogReaction.builder().blogId(blogLike.getBlogId()).userId(blogLike.getUserId()).build();
        BlogReaction saved = blogReactionRepo.save(blogReaction);
        return saved.getId().toHexString();
    }

    @Transactional
    @Override
    public String disLike(ObjectId blogReactionId) {
        blogReactionRepo.findById(blogReactionId).orElseThrow(() -> new NoSuchElementException("Invalid blog reaction ID"));
        blogReactionRepo.deleteById(blogReactionId);
        return "Disliked";
    }
}
