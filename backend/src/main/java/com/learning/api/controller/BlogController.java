package com.learning.api.controller;

import com.learning.api.dto.BlogDataDTO;
import com.learning.api.dto.BlogOverviewDTO;
import com.learning.api.dto.BlogPostDTO;
import com.learning.api.service.BlogService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/blog")
@Slf4j
public class BlogController {

    private final BlogService blogService;

    @Autowired
    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }


    @PostMapping("add")
    public ResponseEntity<String> createBlog(@RequestBody BlogPostDTO blogPostDTO) {
        blogService.createNewBlog(blogPostDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Blog created successfully!");
    }

    //Get all blogs posted by a specific user (user id)
    @GetMapping("get-all-of-user")
    public ResponseEntity<Page<BlogOverviewDTO>> getAllBlogsOfUser(
            @RequestParam(value = "userId") Long userId,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "time", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir
    ) {
        return ResponseEntity.ok(blogService.getAllBlogsOfUser(userId, sortBy, sortDir, pageNumber, pageSize));
    }

    @GetMapping("get/{blogId}")
    public ResponseEntity<BlogDataDTO> getBlogById(@PathVariable Long blogId) {
        return ResponseEntity.ok(blogService.getBlogById(blogId));
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateBlog(@RequestBody BlogDataDTO entity) {
        blogService.updateBlog(entity);
        return ResponseEntity.ok("Blog updated successfully!");
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("search")
    public ResponseEntity<Page<BlogOverviewDTO>> searchResult(
            @RequestParam(value = "keyword") String search,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir,
            @RequestParam(value = "sortBy", defaultValue = "time", required = false) String sortBy
    ) {

        return ResponseEntity.ok(blogService.searchBlogs(search, sortBy, sortDir, pageNumber, pageSize));
    }

    @GetMapping("/get/category")
    public ResponseEntity<Page<BlogOverviewDTO>> getBlogByCategory(
            @RequestParam(value = "id") Long categoryId,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "time", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir
    ) {
        return ResponseEntity.ok(blogService.getAllBlogsByCategory(categoryId, sortDir, sortBy, pageNumber, pageSize));
    }

    @GetMapping("get-all-blogs")
    public ResponseEntity<Page<BlogOverviewDTO>> getAllBlogsWithUser(
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "time", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir
    ) {
        return ResponseEntity.ok(blogService.getAllBlogs(pageNumber, pageSize, sortBy, sortDir));
    }


}
