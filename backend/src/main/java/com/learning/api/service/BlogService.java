package com.learning.api.service;

import com.learning.api.dto.BlogDataDTO;
import com.learning.api.dto.PageResponse;
import com.learning.api.entity.BlogData;
import com.learning.api.exception.BlogNotFoundException;
import org.bson.types.ObjectId;

public interface BlogService {

    void createNewBlog(BlogData blog);

    BlogDataDTO getBlogById(ObjectId id, String sortBy, String sortOrder, int pageNumber, int pageSize);

    void updateBlog(BlogDataDTO blog);

    void deleteBlog(ObjectId id) throws Exception;

    PageResponse<BlogDataDTO> searchBlogs(String title, String sortBy, String sortOrder, int pageNumber, int pageSize) throws Exception;

    PageResponse<BlogDataDTO> getAllBlogsByCategory(ObjectId categoryId, String sortOrder, String sortBy, int pageNumber, int pageSize);

    PageResponse<BlogDataDTO> getAllBlogsOfUser(ObjectId userid, String sortBy, String sortOrder, int pageNumber, int pageSize);

    PageResponse<BlogDataDTO> getAllBlogs(int pageNumber, int pageSize, String sortBy, String sortOrder) throws BlogNotFoundException;

}
