package com.learning.api.controller;

import com.learning.api.dto.BlogReactionRequestDTO;
import com.learning.api.service.BlogReactionService;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/blog/reaction")
public class BlogReactionController {

    private final BlogReactionService blogReactionService;

    public BlogReactionController(BlogReactionService blogReactionService) {
        this.blogReactionService = blogReactionService;
    }

    @PostMapping("like")
    public ResponseEntity<String> like(@RequestBody BlogReactionRequestDTO blogLike) {
        try {
            return ResponseEntity.ok().body(blogReactionService.like(blogLike));
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("dislike")
    public ResponseEntity<String> disLike(@RequestBody ObjectId blogReactionId) {
        try {
            return ResponseEntity.ok().body(blogReactionService.disLike(blogReactionId));
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
