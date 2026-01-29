package com.boot.spring.blogify.controller;

import com.boot.spring.blogify.dto.blog.BlogDTO;
import com.boot.spring.blogify.dto.blog.BlogPostDTO;
import com.boot.spring.blogify.dto.blog.BlogSummaryDTO;
import com.boot.spring.blogify.dto.blog.UpdateBlogRequest;
import com.boot.spring.blogify.service.BlogService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PagedModel;
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
    public ResponseEntity<PagedModel<BlogSummaryDTO>> getAllBlogsOfUser(
            @RequestParam Long userId,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "createdAt", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir
    ) {
        return ResponseEntity.ok(blogService.getAllBlogsOfUser(userId, sortBy, sortDir, pageNumber, pageSize));
    }

    @GetMapping("get/{blogId}")
    public ResponseEntity<BlogDTO> getBlogById(@PathVariable Long blogId) {
        return ResponseEntity.ok(blogService.getBlogById(blogId));
    }

    @PutMapping("update")
    public String updateBlog(@RequestParam Long blogId,@RequestBody UpdateBlogRequest request) {
        blogService.updateBlog(blogId, request);
        return "Blog updated successfully!";
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("search")
    public ResponseEntity<PagedModel<BlogSummaryDTO>> searchResult(
            @RequestParam(value = "keyword") String search,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir,
            @RequestParam(value = "sortBy", defaultValue = "createdAt", required = false) String sortBy
    ) {
        return ResponseEntity.ok(blogService.searchBlogs(search, sortBy, sortDir, pageNumber, pageSize));
    }

    @GetMapping("/get/category")
    public ResponseEntity<PagedModel<BlogSummaryDTO>> getBlogByCategory(
            @RequestParam(value = "id") Long categoryId,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "createdAt", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir
    ) {
        return ResponseEntity.ok(blogService.getAllBlogsByCategory(categoryId, sortDir, sortBy, pageNumber, pageSize));
    }

    @GetMapping("get-all-blogs")
    public ResponseEntity<PagedModel<BlogSummaryDTO>> getAllBlogsWithUser(
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "createdAt", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir
    ) {
        return ResponseEntity.ok(blogService.getAllBlogs(pageNumber, pageSize, sortBy, sortDir));
    }


}
