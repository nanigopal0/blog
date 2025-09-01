package com.learning.api.controller;

import com.learning.api.dto.BlogReactionRequestDTO;
import com.learning.api.dto.BlogReactionResponseDTO;
import com.learning.api.service.BlogReactionService;
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
    public ResponseEntity<BlogReactionResponseDTO> like(@RequestBody BlogReactionRequestDTO blogLike) {
        return ResponseEntity.ok().body(blogReactionService.like(blogLike));
    }

    @DeleteMapping("dislike")
    public ResponseEntity<BlogReactionResponseDTO> disLike(@RequestParam Long blogReactionId) {
        return ResponseEntity.ok().body(blogReactionService.disLike(blogReactionId));
    }
}
