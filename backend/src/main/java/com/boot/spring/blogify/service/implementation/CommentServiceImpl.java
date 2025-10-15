package com.boot.spring.blogify.service.implementation;

import com.boot.spring.blogify.dto.CommentDTO;
import com.boot.spring.blogify.entity.BlogData;
import com.boot.spring.blogify.entity.Comment;
import com.boot.spring.blogify.entity.User;
import com.boot.spring.blogify.exception.BlogNotFoundException;
import com.boot.spring.blogify.exception.CommentNotFoundException;
import com.boot.spring.blogify.repositories.BlogRepo;
import com.boot.spring.blogify.repositories.CommentRepo;
import com.boot.spring.blogify.repositories.UserRepo;
import com.boot.spring.blogify.service.CommentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepo commentRepo;
    private final BlogRepo blogRepo;
    private final UserRepo userRepo;

    public CommentServiceImpl(CommentRepo commentRepo, BlogRepo blogRepo, UserRepo userRepo) {
        this.commentRepo = commentRepo;
        this.blogRepo = blogRepo;
        this.userRepo = userRepo;
    }

    @Override
    public CommentDTO saveComment(CommentDTO comment) {
        User user = userRepo.findById(comment.getUserId()).orElseThrow(() -> new CommentNotFoundException(" Id: " + comment.getUserId()));
        BlogData blogData = blogRepo.findById(comment.getBlogId()).orElseThrow(() -> new BlogNotFoundException(" Id: " + comment.getBlogId()));
        Comment comment1 = Comment.builder()
                .commentedAt(LocalDateTime.now())
                .blog(blogData)
                .comment(comment.getComment())
                .user(user)
                .build();
        Comment saved = commentRepo.save(comment1);
        comment.setCommentedAt(saved.getCommentedAt());
        comment.setId(saved.getCommentId());
        return comment;
    }

    @Override
    public String deleteComment(Long commentID) {
        Comment comment = commentRepo.findById(commentID).orElseThrow(CommentNotFoundException::new);
        commentRepo.delete(comment);
        return "Successfully deleted comment";
    }

    @Override
    public String updateComment(CommentDTO comment) {
        Comment prevComment = commentRepo.findById(comment.getId()).orElseThrow(() -> new CommentNotFoundException("Comment not found!"));
        prevComment.setComment(comment.getComment());
        commentRepo.save(prevComment);
        return "Successfully updated comment";
    }

    @Override
    public CommentDTO getComment(Long commentID) {
        Comment comment = commentRepo.findById(commentID).orElseThrow(CommentNotFoundException::new);
        return CommentDTO.builder()
                .id(comment.getCommentId())
                .userId(comment.getUser().getId())
                .blogId(comment.getBlog().getId())
                .commentedAt(comment.getCommentedAt())
                .userFullName(comment.getUser().getName())
                .userPhoto(comment.getUser().getPhoto())
                .comment(comment.getComment())
                .build();
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
