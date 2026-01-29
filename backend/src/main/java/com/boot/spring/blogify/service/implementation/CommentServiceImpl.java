package com.boot.spring.blogify.service.implementation;

import com.boot.spring.blogify.dto.CommentDTO;
import com.boot.spring.blogify.entity.blog.Comment;
import com.boot.spring.blogify.exception.CommentNotFoundException;
import com.boot.spring.blogify.repositories.CommentRepo;
import com.boot.spring.blogify.service.BlogService;
import com.boot.spring.blogify.service.CommentService;
import com.boot.spring.blogify.service.UserService;
import com.boot.spring.blogify.util.EntityToDTO;
import com.boot.spring.blogify.util.GeneralMethod;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepo commentRepo;

    private final UserService userService;
    private final BlogService blogService;
    private final EntityToDTO entityToDTO;

    public CommentServiceImpl(CommentRepo commentRepo, UserService userService, BlogService blogService, EntityToDTO entityToDTO) {
        this.commentRepo = commentRepo;
        this.userService = userService;
        this.blogService = blogService;
        this.entityToDTO = entityToDTO;
    }

    @Transactional
    @Override
    public void saveComment(String comment, Long blogId) {
        Long commenterId = GeneralMethod.findAuthenticatedUserId();
        commentRepo.saveComment(commenterId, blogId, comment);
//        Long userId = GeneralMethod.findAuthenticatedUserId();
//        User user = userService.findById(userId);
//        BlogData blog = blogService.findBlogById(blogId);
//        Comment c = new Comment(null, user, blog, comment, LocalDateTime.now());
//        Comment saved = commentRepo.save(c);
//        return entityToDTO.convertCommentToCommentDTO(saved);
    }

    @Override
    public void deleteComment(Long commentID) {
        commentRepo.deleteById(commentID);
    }

    @Override
    @Transactional
    public void updateComment(Long commentId, String comment) {
        Comment prevComment = commentRepo.findById(commentId).orElseThrow(() -> new CommentNotFoundException("Comment not found!"));
        prevComment.setComment(comment);
        commentRepo.save(prevComment);
//        return entityToDTO.convertCommentToCommentDTO(updated);
    }

    @Override
    public PagedModel<CommentDTO> getComments(Long blogId, int pageNumber, int pageSize) {
        Pageable pageable = GeneralMethod.getPageable("commentedAt", "desc", pageNumber, pageSize);
        return new PagedModel<>(commentRepo.findCommentsByBlogId(blogId, pageable));
    }

    @Override
    public void deleteAllCommentsByBlogId(Long blogId) {
        commentRepo.deleteAllByBlogId(blogId);
    }

    @Override
    public void deleteAllCommentsByUserId(Long userId) {
        commentRepo.deleteAllByUserId(userId);
    }
}
