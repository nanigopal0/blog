package com.learning.api.service.implement;

import com.learning.api.dto.CategoryDTO;
import com.learning.api.entity.Category;
import com.learning.api.repositories.CategoryRepo;
import com.learning.api.service.CategoryService;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepo categoryRepo;

    public CategoryServiceImpl(CategoryRepo categoryRepo) {
        this.categoryRepo = categoryRepo;
    }

    @Transactional
    @Override
    public String addCategories(List<Category> categories) {
        categoryRepo.saveAll(categories);
        return "Category added successfully!";
    }

    @Override
    public String addCategory(Category category) {
        categoryRepo.save(category);
        return category + " added successfully!";
    }

    @Override
    public List<CategoryDTO> getAllCategories() {
        return categoryRepo.findAll().stream().map((category) ->
                CategoryDTO.builder()
                        .id(category.getId().toHexString())
                        .category(category.getCategory())
                        .build()).toList();
    }

    @Override
    public String deleteCategory(ObjectId categoryID) {
        Category category = categoryRepo.findById(categoryID).orElseThrow();
        categoryRepo.deleteById(category.getId());
        return categoryID + " deleted successfully!";
    }

    @Override
    public String updateCategory(ObjectId categoryID, String category) {
        Category categoryDB = categoryRepo.findById(categoryID).orElseThrow();
        categoryDB.setCategory(category);
        categoryRepo.save(categoryDB);
        return categoryID + " updated successfully!";
    }
}
