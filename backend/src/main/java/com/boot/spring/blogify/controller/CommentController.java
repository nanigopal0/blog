package com.boot.spring.blogify.controller;

import com.boot.spring.blogify.dto.CommentDTO;
import com.boot.spring.blogify.service.CommentService;
import lombok.extern.slf4j.Slf4j;
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
    public ResponseEntity<CommentDTO> saveComment(@RequestBody CommentDTO comment) {
        return new ResponseEntity<>(commentService.saveComment(comment), HttpStatus.CREATED);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteComment(@RequestParam(value = "commentID") Long commentID) {
        return new ResponseEntity<>(commentService.deleteComment(commentID), HttpStatus.NO_CONTENT);
    }

    @PutMapping
    public ResponseEntity<String> updateComment(@RequestBody CommentDTO comment) {
        return new ResponseEntity<>(commentService.updateComment(comment), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<CommentDTO> getComment(@RequestParam(value = "commentID") Long commentID) {
        return new ResponseEntity<>(commentService.getComment(commentID), HttpStatus.CREATED);
    }
}
