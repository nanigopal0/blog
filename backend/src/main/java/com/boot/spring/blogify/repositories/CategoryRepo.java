package com.boot.spring.blogify.repositories;

import com.boot.spring.blogify.dto.CategoryDTO;
import com.boot.spring.blogify.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepo extends JpaRepository<Category, Long> {
    //    @Query("""
//                SELECT c.id AS categoryId,c.category AS categoryName from Category c WHERE c.category LIKE :categoryName%
//            """)
    List<CategoryDTO> findCategoriesByCategoryStartsWith(@Param("categoryName") String categoryName);


    List<CategoryDTO> findAllBy();
}
