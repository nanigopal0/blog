package com.boot.spring.blogify.service;

import com.boot.spring.blogify.dto.blog.BlogDTO;
import com.boot.spring.blogify.dto.blog.BlogPostDTO;
import com.boot.spring.blogify.dto.blog.BlogSummaryDTO;
import com.boot.spring.blogify.dto.blog.UpdateBlogRequest;
import com.boot.spring.blogify.entity.blog.BlogData;
import org.springframework.data.web.PagedModel;

public interface BlogService {

    void createNewBlog(BlogPostDTO blog);

    BlogDTO getBlogById(Long id);

    void updateBlog(Long blogId, UpdateBlogRequest request);

    Long countTotalBlogsByUserId(Long userId);

    BlogData findBlogById(Long blogId);

    void deleteBlog(Long blogId);

    void deleteAllBlogsByUserId(Long userId);

    PagedModel<BlogSummaryDTO> searchBlogs(String title, String sortBy, String sortOrder, int pageNumber, int pageSize);

    PagedModel<BlogSummaryDTO> getAllBlogsByCategory(Long categoryId, String sortOrder, String sortBy, int pageNumber, int pageSize);

    //Get all blogs posted by the user
    PagedModel<BlogSummaryDTO> getAllBlogsOfUser(Long userid, String sortBy, String sortOrder, int pageNumber, int pageSize);

    PagedModel<BlogSummaryDTO> getAllBlogs(int pageNumber, int pageSize, String sortBy, String sortOrder);

}
