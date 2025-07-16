package com.learning.api.controller;

import com.learning.api.dto.BlogDataDTO;
import com.learning.api.dto.PageResponse;
import com.learning.api.entity.BlogData;
import com.learning.api.exception.BlogNotFoundException;
import com.learning.api.exception.UserNotFoundException;
import com.learning.api.service.BlogService;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<String> createBlog(@RequestBody BlogData entity) {
        try {
            blogService.createNewBlog(entity);
            return ResponseEntity.status(HttpStatus.CREATED).body("Blog created successfully!");
        } catch (UserNotFoundException e) {
            log.error("User not found {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("create blog: Something went wrong! {}", e.getMessage());
            return ResponseEntity.internalServerError().body(e.getMessage());
        }

    }

    //Get all blogs posted by a specific user (user id)
    @GetMapping("get-all-of-user")
    public ResponseEntity<PageResponse<BlogDataDTO>> getAllBlogsOfUser(
            @RequestParam(value = "userId") ObjectId userId,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "time", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir
    ) {
        try {
            PageResponse<BlogDataDTO> blogsPage = blogService.getAllBlogsOfUser(userId, sortBy, sortDir, pageNumber, pageSize);
            if (blogsPage.getContent().isEmpty()) return ResponseEntity.notFound().build();
            else return ResponseEntity.ok(blogsPage);
        } catch (Exception e) {
            log.error("get-all-blog-of-user: Blog not found {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("get-blog/{blogId}")
    public ResponseEntity<BlogDataDTO> getBlogById(
            @PathVariable ObjectId blogId,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir,
            @RequestParam(value = "sortBy", defaultValue = "commentedAt", required = false) String sortBy
    ) {
        try {
            return ResponseEntity.ok(blogService.getBlogById(blogId, sortBy, sortDir, pageNumber, pageSize));
        } catch (BlogNotFoundException ex) {
            log.warn("get-blog-by-id: Blog not found. {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("get-blog-by-id: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("update/{id}")
    public ResponseEntity<?> updateBlog(@RequestBody BlogDataDTO entity) {
        try {
            blogService.updateBlog(entity);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("updateBlog: Failed to update Blog! {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable ObjectId id) {
        try {
            blogService.deleteBlog(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("deleteBlog: Failed to delete blog! ${}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("search")
    public ResponseEntity<PageResponse<BlogDataDTO>> searchResult(
            @RequestParam(value = "keyword") String search,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir,
            @RequestParam(value = "sortBy", defaultValue = "time", required = false) String sortBy
    ) {
        try {
            PageResponse<BlogDataDTO> blogPage = blogService.searchBlogs(search, sortBy, sortDir, pageNumber, pageSize);
            if (blogPage.getContent().isEmpty()) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(blogPage);
        } catch (BlogNotFoundException ex) {
            log.error("searchResult: {}", ex.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("searchBlog {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("search-category")
    public ResponseEntity<PageResponse<BlogDataDTO>> searchBlogByCategory(
            @RequestParam(value = "categoryId") ObjectId categoryId,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "time", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir) {
        try {
            return ResponseEntity.ok(blogService.getAllBlogsByCategory(categoryId, sortDir, sortBy, pageNumber, pageSize));
        } catch (BlogNotFoundException blogNotFoundException) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("get-all-blogs")
    public ResponseEntity<PageResponse<BlogDataDTO>> getAllBlogsWithUser(
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "time", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir
    ) {
        try {
            return ResponseEntity.ok(blogService.getAllBlogs(pageNumber, pageSize, sortBy, sortDir));
        } catch (IllegalArgumentException e) {
            log.error(e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("get-all-blogs ${}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }


}
