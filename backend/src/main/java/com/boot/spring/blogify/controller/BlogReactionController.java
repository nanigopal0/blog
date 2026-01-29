package com.boot.spring.blogify.controller;

import com.boot.spring.blogify.dto.blog.BlogReactionDTO;
import com.boot.spring.blogify.dto.blog.BlogReactionRequestDTO;
import com.boot.spring.blogify.service.BlogReactionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/blog/reaction")
public class BlogReactionController {

    private final BlogReactionService blogReactionService;

    public BlogReactionController(BlogReactionService blogReactionService) {
        this.blogReactionService = blogReactionService;
    }

    @PostMapping("like")
    public ResponseEntity<BlogReactionDTO> like(@RequestParam Long blogId) {
        return ResponseEntity.ok().body(blogReactionService.like(blogId));
    }

    @DeleteMapping("dislike")
    public ResponseEntity<BlogReactionDTO> disLike(
            @RequestParam Long blogReactionId,
            @RequestParam Long blogId
    ) {
        return ResponseEntity.ok().body(blogReactionService.disLike(blogReactionId, blogId));
    }
}
