package com.learning.api.service;

import com.learning.api.dto.CategoryDTO;
import com.learning.api.entity.Category;

import java.util.List;

public interface CategoryService {
    String addCategory(Category category);

    List<CategoryDTO> getAllCategories();

    String deleteCategory(Long categoryID);

    String updateCategory(Long categoryID, String category);

    String addCategories(List<Category> categories);

    List<CategoryDTO> searchCategory(String categoryName);
}
