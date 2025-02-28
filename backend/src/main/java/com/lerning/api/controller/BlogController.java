package com.lerning.api.controller;

import com.lerning.api.entity.BlogData;
import com.lerning.api.entity.GetAllBlog;
import com.lerning.api.service.BlogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/blog")

public class BlogController {


    private final BlogService blogService;
    private final Logger logger = LoggerFactory.getLogger(BlogController.class);

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @PostMapping("add")
    public ResponseEntity<BlogData> createBlog(@RequestBody BlogData entity) {
        try {
            BlogData blog = blogService.saveBlogData(entity);
            return ResponseEntity.status(HttpStatus.CREATED).body(blog);
        } catch (Exception e) {
            logger.error("create blog: Something went wrong! ${}", e.getMessage());
            return ResponseEntity.internalServerError().body(null);
        }

    }

    @GetMapping("get-all-of-user")
    public ResponseEntity<List<BlogData>> getAllBlogsOfUser() {
        try {
            List<BlogData> blogs = blogService.getAllBlogsOfUser();
            if (blogs.isEmpty())
                return ResponseEntity.notFound().build();
            else
                return ResponseEntity.ok(blogs);
        } catch (Exception e) {
            logger.error("get-all-blog-of-user: Blog not found ${}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("get/{id}")
    public ResponseEntity<GetAllBlog> getBlogById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(blogService.geBlogDataById(id));
        } catch (Exception e) {
            logger.error("get-blog-by-id: Blog not found ${}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("get-all")
    public ResponseEntity<List<BlogData>> getAllBlog() {
        try {
            List<BlogData> blogs = blogService.getAllBlogs();
            if (!blogs.isEmpty())
                return ResponseEntity.ok(blogs);
            else
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            logger.error("getAllBlog: Blog not found ${}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("update/{id}")
    public ResponseEntity<BlogData> updateBlog(@PathVariable String id, @RequestBody BlogData entity) {
        try {
            BlogData blog = blogService.updateBlog(id, entity);
            return ResponseEntity.ok(blog);
        } catch (Exception e) {
            logger.error("updateBlog: Failed to update Blog! ${}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable String id) {
        try {
            blogService.deleteBlog(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("deleteBlog: Failed to delete blog! ${}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("search")
    public ResponseEntity<List<GetAllBlog>> searchResult(@RequestParam("title") String search) {
        try {
            return ResponseEntity.ok(blogService.searchBlogData(search));
        } catch (Exception e) {
            logger.error("searchBlog ${}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("get-all-blogs")
    public ResponseEntity<List<GetAllBlog>> getAllBlogsWithUser() {
        try {
            return ResponseEntity.ok(blogService.getAllBlogsWithUserInfo());
        } catch (Exception e) {
            logger.error("get-all-blogs ${}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }


}
