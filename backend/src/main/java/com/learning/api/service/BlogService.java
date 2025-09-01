package com.learning.api.service;

import com.learning.api.dto.BlogDataDTO;
import com.learning.api.dto.BlogOverviewDTO;
import com.learning.api.dto.BlogPostDTO;
import org.springframework.data.domain.Page;

public interface BlogService {

    void createNewBlog(BlogPostDTO blog);

    BlogDataDTO getBlogById(Long id);

    void updateBlog(BlogDataDTO blog);

    Long countTotalBlogsByUserId(Long userId);

    void deleteBlog(Long blogId);

    void deleteAllBlogsByUserId(Long userId);

    Page<BlogOverviewDTO> searchBlogs(String title, String sortBy, String sortOrder, int pageNumber, int pageSize);

    Page<BlogOverviewDTO> getAllBlogsByCategory(Long categoryId, String sortOrder, String sortBy, int pageNumber, int pageSize);

    //Get all blogs posted by the user
    Page<BlogOverviewDTO> getAllBlogsOfUser(Long userid, String sortBy, String sortOrder, int pageNumber, int pageSize);

    Page<BlogOverviewDTO> getAllBlogs(int pageNumber, int pageSize, String sortBy, String sortOrder);

}
