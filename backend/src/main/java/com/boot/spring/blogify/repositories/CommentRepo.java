package com.boot.spring.blogify.repositories;

import com.boot.spring.blogify.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepo extends JpaRepository<Comment, Long> {

    void deleteAllByBlogId(Long blogId);

    void deleteAllByUserId(Long userId);
}
