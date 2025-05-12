package com.learning.api.service;

import com.learning.api.dto.CategoryDTO;
import com.learning.api.entity.Category;
import org.bson.types.ObjectId;

import java.util.List;

public interface CategoryService {
    String addCategory(Category category);

    List<CategoryDTO> getAllCategories();

    String deleteCategory(ObjectId categoryID);

    String updateCategory(ObjectId categoryID, String category);

    String addCategories(List<Category> categories);
}
