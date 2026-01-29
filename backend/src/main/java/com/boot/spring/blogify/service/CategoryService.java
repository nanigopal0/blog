package com.boot.spring.blogify.service;

import com.boot.spring.blogify.dto.CategoryDTO;
import com.boot.spring.blogify.entity.blog.Category;

import java.util.List;

public interface CategoryService {
    String addCategory(Category category);

    List<CategoryDTO> getAllCategories();

    String deleteCategory(Long categoryID);

    String updateCategory(Long categoryID, String category);

    String addCategories(List<Category> categories);

    List<CategoryDTO> searchCategory(String categoryName);
}
