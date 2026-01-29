package com.boot.spring.blogify.service.implementation;

import com.boot.spring.blogify.dto.CategoryDTO;
import com.boot.spring.blogify.entity.blog.Category;
import com.boot.spring.blogify.repositories.CategoryRepo;
import com.boot.spring.blogify.service.CategoryService;
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
    public List<CategoryDTO> searchCategory(String categoryName) {
        return categoryRepo.findCategoriesByCategoryStartsWith(categoryName);
    }

    @Override
    public String addCategory(Category category) {
        categoryRepo.save(category);
        return category + " added successfully!";
    }

    @Override
    public List<CategoryDTO> getAllCategories() {
        return categoryRepo.findAllBy();
    }

    @Override
    public String deleteCategory(Long categoryID) {
        Category category = categoryRepo.findById(categoryID).orElseThrow();
        categoryRepo.deleteById(category.getId());
        return categoryID + " deleted successfully!";
    }

    @Override
    public String updateCategory(Long categoryID, String category) {
        Category categoryDB = categoryRepo.findById(categoryID).orElseThrow();
        categoryDB.setCategory(category);
        categoryRepo.save(categoryDB);
        return categoryID + " updated successfully!";
    }
}
