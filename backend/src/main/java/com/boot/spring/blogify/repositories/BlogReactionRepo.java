package com.boot.spring.blogify.repositories;

import com.boot.spring.blogify.dto.blog.BlogReactionDTO;
import com.boot.spring.blogify.entity.blog.BlogReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface BlogReactionRepo extends JpaRepository<BlogReaction, Long> {
    void deleteAllByBlogId(Long blogId);

    void deleteAllByUserId(Long userId);

    @Modifying
    @Query(value = "INSERT INTO blog_reactions(user_id,blog_id) VALUES (:userId,:blogId)", nativeQuery = true)
    void save(Long blogId, Long userId);


    @Query("""
            SELECT new com.boot.spring.blogify.dto.blog.BlogReactionDTO(
                (SELECT b.id FROM BlogReaction b WHERE b.blog.id = :blogId AND b.user.id = :userId),
                (SELECT COUNT(b1) FROM BlogReaction b1 WHERE b1.blog.id = :blogId)
            ) FROM BlogData b2 WHERE b2.id = :blogId
            """)
    Optional<BlogReactionDTO> findBlogReactionsById(Long blogId, Long userId);
}
