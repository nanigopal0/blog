package com.boot.spring.blogify.service;

import com.boot.spring.blogify.dto.CommentDTO;

public interface CommentService {

    CommentDTO saveComment(CommentDTO comment);

    String deleteComment(Long commentID);

    String updateComment(CommentDTO comment);

    CommentDTO getComment(Long commentID);

    void deleteAllCommentsByBlogId(Long blogId);

    void deleteAllCommentsByUserId(Long userId);
}
