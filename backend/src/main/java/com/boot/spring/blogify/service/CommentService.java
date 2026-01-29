package com.boot.spring.blogify.service;

import com.boot.spring.blogify.dto.CommentDTO;
import org.springframework.data.web.PagedModel;

public interface CommentService {

    void saveComment(String comment, Long blogId);

    void deleteComment(Long commentID);

    void updateComment(Long commentId, String comment);

    PagedModel<CommentDTO> getComments(Long blogId, int pageNumber, int pageSize);

    void deleteAllCommentsByBlogId(Long blogId);

    void deleteAllCommentsByUserId(Long userId);
}
