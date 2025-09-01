package com.learning.api.repositories;

import com.learning.api.dto.BlogOverviewDTO;
import com.learning.api.entity.BlogData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface BlogRepo extends JpaRepository<BlogData, Long> {

    //    @Query("""
//            SELECT b.id AS blogId, b.title AS title, b.content AS content, b.coverImage AS coverImage,
//            b.category AS category, b.user AS user, b.time AS postedAt FROM BlogData b WHERE b.title LIKE :title%
//            """)
    Page<BlogOverviewDTO> findByTitleStartsWith(String title, Pageable pageable);

    Page<BlogOverviewDTO> findAllByCategoryId(Long categoryId, Pageable pageable);

    //    @Query("""
//            SELECT b.id AS blogId, b.title AS title, b.coverImage AS coverImage, b.content AS content,
//            b.category AS category, b.user AS user, b.time AS postedAt FROM BlogData b
//            """)
    Page<BlogOverviewDTO> findAllBy(Pageable pageable);

    //    @Query("""
//            SELECT b.id AS blogId, b.title AS title, b.coverImage AS coverImage, b.content AS content,
//            b.category AS category, b.user AS user, b.time AS postedAt FROM BlogData b WHERE b.user.id =:userId
//            """
//    )
    Page<BlogOverviewDTO> findAllBlogsByUserId(Long userId, Pageable pageable);

    void deleteAllByUserId(Long userId);

    //count the number of blogs posted by a specific user
    Long countByUser_Id(Long userId);
}
