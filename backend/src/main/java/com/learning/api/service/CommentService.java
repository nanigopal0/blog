package com.learning.api.service;

import com.learning.api.dto.CommentDTO;

public interface CommentService {

    CommentDTO saveComment(CommentDTO comment);

    String deleteComment(Long commentID);

    String updateComment(CommentDTO comment);

    CommentDTO getComment(Long commentID);

    void deleteAllCommentsByBlogId(Long blogId);

    void deleteAllCommentsByUserId(Long userId);
}
