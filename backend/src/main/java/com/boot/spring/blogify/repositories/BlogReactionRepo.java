package com.boot.spring.blogify.repositories;

import com.boot.spring.blogify.entity.BlogReaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BlogReactionRepo extends JpaRepository<BlogReaction, Long> {
    void deleteAllByBlogId(Long blogId);

    void deleteAllByUserId(Long userId);

    Long countBlogReactionsByBlogId(Long blogId);

    Optional<BlogReaction> findBlogReactionIdByUserIdAndBlogId(Long userId, Long blogId);

}
