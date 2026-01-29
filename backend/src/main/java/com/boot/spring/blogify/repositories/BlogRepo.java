package com.boot.spring.blogify.repositories;

import com.boot.spring.blogify.dto.blog.BlogDTO;
import com.boot.spring.blogify.dto.blog.BlogSummaryDTO;
import com.boot.spring.blogify.entity.blog.BlogData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface BlogRepo extends JpaRepository<BlogData, Long> {

    @Query("""
            SELECT new com.boot.spring.blogify.dto.blog.BlogSummaryDTO(
                new com.boot.spring.blogify.dto.blog.BlogOverviewDTO(b.id, b.title, b.coverImage, b.content,b.createdAt),
                new com.boot.spring.blogify.dto.CategoryDTO(b.category.id,b.category.category),
                new com.boot.spring.blogify.dto.user.UserOverviewDTO(b.user.id,b.user.name,b.user.photo)
            )
            FROM BlogData b JOIN b.user JOIN b.category WHERE b.title LIKE :title%
            """)
    Page<BlogSummaryDTO> findByTitleStartsWith(String title, Pageable pageable);


    @Query("""
             SELECT new com.boot.spring.blogify.dto.blog.BlogSummaryDTO(
                            new com.boot.spring.blogify.dto.blog.BlogOverviewDTO(b.id, b.title, b.coverImage, b.content,b.createdAt),
                            new com.boot.spring.blogify.dto.CategoryDTO(b.category.id,b.category.category),
                            new com.boot.spring.blogify.dto.user.UserOverviewDTO(b.user.id,b.user.name,b.user.photo)
                        )
                        FROM BlogData b JOIN b.category JOIN b.user WHERE b.category.id = :categoryId
            """)
    Page<BlogSummaryDTO> findAllByCategoryId(Long categoryId, Pageable pageable);

    @Query("""
            SELECT new com.boot.spring.blogify.dto.blog.BlogSummaryDTO(
                new com.boot.spring.blogify.dto.blog.BlogOverviewDTO(b.id, b.title, b.coverImage, b.content,b.createdAt),
                new com.boot.spring.blogify.dto.CategoryDTO(b.category.id,b.category.category),
                new com.boot.spring.blogify.dto.user.UserOverviewDTO(b.user.id,b.user.name,b.user.photo)
            ) FROM BlogData b JOIN b.category JOIN b.user
            """)
    Page<BlogSummaryDTO> findAllBy(Pageable pageable);

    @Query("""
            SELECT new com.boot.spring.blogify.dto.blog.BlogSummaryDTO(
                new com.boot.spring.blogify.dto.blog.BlogOverviewDTO(b.id, b.title, b.coverImage, b.content,b.createdAt),
                new com.boot.spring.blogify.dto.CategoryDTO(b.category.id,b.category.category),
                new com.boot.spring.blogify.dto.user.UserOverviewDTO(b.user.id,b.user.name,b.user.photo)
            )
            FROM BlogData b JOIN b.user JOIN b.category WHERE b.user.id =:userId
            """
    )
    Page<BlogSummaryDTO> findAllBlogsByUserId(Long userId, Pageable pageable);

    void deleteAllByUserId(Long userId);

    //count the number of blogs posted by a specific user
    Long countByUser_Id(Long userId);

    @Query("""
            SELECT new com.boot.spring.blogify.dto.blog.BlogDTO(
                new com.boot.spring.blogify.dto.blog.BlogOverviewDTO(b.id, b.title, b.coverImage, b.content,b.createdAt),
                new com.boot.spring.blogify.dto.CategoryDTO(b.category.id,b.category.category),
                new com.boot.spring.blogify.dto.user.UserOverviewDTO(b.user.id,b.user.name,b.user.photo),
                new com.boot.spring.blogify.dto.blog.BlogReactionDTO(
                    (SELECT r1.id FROM BlogReaction r1 WHERE r1.blog.id = :blogId AND r1.user.id = :currentUserId),
                    (SELECT COUNT(r) FROM BlogReaction r WHERE r.blog.id = :blogId)
                )
            )
            FROM BlogData b JOIN b.user JOIN b.category WHERE b.id = :blogId
            """)
    BlogDTO findBlogById(Long blogId, Long currentUserId);
}
