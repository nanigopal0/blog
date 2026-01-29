package com.boot.spring.blogify.controller;


import com.boot.spring.blogify.dto.CategoryDTO;
import com.boot.spring.blogify.entity.blog.Category;
import com.boot.spring.blogify.service.CategoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("category")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addCategory(@RequestBody Category category) {
        return new ResponseEntity<>(categoryService.addCategory(category), HttpStatus.CREATED);
    }

    @PostMapping("/add-all")
    public ResponseEntity<String> addCategories(@RequestBody List<Category> categories) {
        return new ResponseEntity<>(categoryService.addCategories(categories), HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateCategory(@RequestParam(value = "category_id") Long categoryId, @RequestBody String category) {
        return new ResponseEntity<>(categoryService.updateCategory(categoryId, category), HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        return new ResponseEntity<>(categoryService.getAllCategories(), HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<CategoryDTO>> searchCategory(@RequestParam String categoryName) {
        return ResponseEntity.ok(categoryService.searchCategory(categoryName));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteCategory(Long categoryID) {
        return new ResponseEntity<>(categoryService.deleteCategory(categoryID), HttpStatus.NO_CONTENT);
    }
}
