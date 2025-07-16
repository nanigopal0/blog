package com.learning.api.service.implement;

import com.learning.api.dto.CommentDTO;
import com.learning.api.entity.Comment;
import com.learning.api.exception.BlogNotFoundException;
import com.learning.api.exception.CommentNotFoundException;
import com.learning.api.repositories.BlogRepo;
import com.learning.api.repositories.CommentRepo;
import com.learning.api.service.CommentService;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepo commentRepo;

    private final BlogRepo blogRepo;


    public CommentServiceImpl(CommentRepo commentRepo, BlogRepo blogRepo) {
        this.commentRepo = commentRepo;
        this.blogRepo = blogRepo;

    }

    private static String getEmailFromAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @Override
//    @Transactional
    public CommentDTO saveComment(CommentDTO comment) {
        blogRepo.findById(new ObjectId(comment.getBlogId())).orElseThrow(() -> new BlogNotFoundException("Blog not found!"));
        Comment comment1 = Comment.builder()
                .commentedAt(LocalDateTime.now())
                .blogId(new ObjectId(comment.getBlogId()))
                .comment(comment.getComment())
                .userId(new ObjectId(comment.getUserId()))
                .build();
        Comment saved = commentRepo.save(comment1);
        comment.setCommentedAt(saved.getCommentedAt());
        comment.setId(saved.getCommentId().toHexString());
        return comment;
//        blogData.getCommentIds().add(savedComment.getCommentId());
//        blogRepo.save(blogData);
//        String email = getEmailFromAuthentication();
//        User user = userRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found!"));
//        user.getCommentIds().add(comment1.getCommentId());
    }

    @Override
    public String deleteComment(ObjectId commentID) {
        Comment comment = commentRepo.findById(commentID).orElseThrow(CommentNotFoundException::new);
        commentRepo.delete(comment);
//        BlogData blogData = blogRepo.findById(comment.getBlogId()).orElseThrow(() -> new BlogNotFoundException("Blog not found!"));
//        blogData.getCommentIds().remove(comment.getCommentId());
//        blogRepo.save(blogData);
//        User user = userRepo.findByEmail(getEmailFromAuthentication()).orElseThrow(() -> new UserNotFoundException("User not found!"));
//        user.getCommentIds().remove(comment.getCommentId());
//        userRepo.save(user);
        return "Successfully deleted comment";
    }

    @Override
    public String updateComment(CommentDTO comment) {
        Comment prevComment = commentRepo.findById(new ObjectId(comment.getId())).orElseThrow(() -> new CommentNotFoundException("Comment not found!"));
        prevComment.setComment(comment.getComment());
        commentRepo.save(prevComment);
        return "Successfully updated comment";
    }

    @Override
    public Comment getComment(ObjectId commentID) {
        return commentRepo.findById(commentID).orElseThrow(CommentNotFoundException::new);
    }
}
