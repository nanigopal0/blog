package com.learning.api.repositories;

import com.learning.api.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepo extends JpaRepository<Comment, Long> {

    void deleteAllByBlogId(Long blogId);

    void deleteAllByUserId(Long userId);
}
