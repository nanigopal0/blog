package com.boot.spring.blogify.controller;

import com.boot.spring.blogify.dto.CommentDTO;
import com.boot.spring.blogify.service.CommentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.web.PagedModel;
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

    @PostMapping("add")
    public ResponseEntity<String> saveComment(@RequestBody String comment, @RequestParam Long blogId) {
        commentService.saveComment(comment, blogId);
        return ResponseEntity.status(HttpStatus.CREATED).body("Comment added successfully!");
    }

    @DeleteMapping("delete")
    public ResponseEntity<Void> deleteComment(@RequestParam Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping("update")
    public ResponseEntity<String> updateComment(@RequestBody String comment, @RequestParam Long commentId) {
        commentService.updateComment(commentId, comment);
        return ResponseEntity.ok("Comment updated successfully!");
    }

    @GetMapping("get")
    public ResponseEntity<PagedModel<CommentDTO>> getPaginatedComments(
            @RequestParam Long blogId,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
    ) {
        return ResponseEntity.ok(commentService.getComments(blogId, pageNumber, pageSize));
    }

}
