package com.learning.api.controller;

import com.learning.api.dto.CommentDTO;
import com.learning.api.entity.Comment;
import com.learning.api.service.CommentService;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("comment")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<?> saveComment(@RequestBody CommentDTO comment) {
        try {
            return new ResponseEntity<>(commentService.saveComment(comment), HttpStatus.CREATED);
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping
    public ResponseEntity<String> deleteComment(@RequestParam(value = "commentID") ObjectId commentID) {
        try {
            return new ResponseEntity<>(commentService.deleteComment(commentID), HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping
    public ResponseEntity<String> updateComment(@RequestBody CommentDTO comment) {
        try {
            return new ResponseEntity<>(commentService.updateComment(comment), HttpStatus.OK);
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<Comment> getComment(@RequestParam(value = "commentID") ObjectId commentID) {
        try {
            return new ResponseEntity<>(commentService.getComment(commentID), HttpStatus.CREATED);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
