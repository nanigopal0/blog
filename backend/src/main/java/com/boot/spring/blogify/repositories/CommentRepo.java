package com.boot.spring.blogify.repositories;

import com.boot.spring.blogify.dto.CommentDTO;
import com.boot.spring.blogify.entity.blog.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface CommentRepo extends JpaRepository<Comment, Long> {

    void deleteAllByBlogId(Long blogId);

    void deleteAllByUserId(Long userId);

    @Query("""
                SELECT new com.boot.spring.blogify.dto.CommentDTO(
                    c.commentId,
                    new com.boot.spring.blogify.dto.user.UserOverviewDTO(c.user.id,c.user.name,c.user.photo),
                    c.commentedAt,
                    c.comment
                )
                FROM Comment c JOIN c.blog JOIN c.user WHERE c.blog.id = :blogId
            """)
    Page<CommentDTO> findCommentsByBlogId(Long blogId, Pageable pageable);


    @Modifying
    @Query(value = """
                    INSERT INTO comments (comment, blog_id, user_id) VALUES (:comment,:blogId,:userId)
            """, nativeQuery = true)
    void saveComment(Long userId, Long blogId, String comment);

//    @Query("""
//                SELECT new com.boot.spring.blogify.dto.CommentDTO(
//                    c.commentId,
//                    new com.boot.spring.blogify.dto.user.UserOverviewDTO(c.user.id,c.user.name,c.user.photo),
//                    c.commentedAt,
//                    c.comment
//                ) FROM Comment c JOIN c.user WHERE c.commentId = LAST_INSERT_ID()
//            """)
//    CommentDTO findLastInsertedAsDTO();
}
