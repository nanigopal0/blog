package com.learning.api.repositories;

import com.learning.api.dto.BlogDataDTO;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomBlogRepo {
    Page<BlogDataDTO> findAllBlogsWithUserInfo(Pageable pageable);

    BlogDataDTO findBlogById(ObjectId blogId, ObjectId userId, Pageable pageable);

    Page<BlogDataDTO> findBlogsByCategory(ObjectId categoryId, Pageable pageable);

    Page<BlogDataDTO> findBlogsByUserId(ObjectId userid, Pageable pageable);

    Page<BlogDataDTO> searchBlogsByTitle(String keyword, Pageable pageable);
}
