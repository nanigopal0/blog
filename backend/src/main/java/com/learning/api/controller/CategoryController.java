package com.learning.api.controller;


import com.learning.api.dto.CategoryDTO;
import com.learning.api.entity.Category;
import com.learning.api.service.CategoryService;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@Slf4j
@RestController
@RequestMapping("category")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping("add")
    public ResponseEntity<String> addCategory(@RequestBody Category category) {
        try {
            return new ResponseEntity<>(categoryService.addCategory(category), HttpStatus.CREATED);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/add-all")
    public ResponseEntity<String> addCategories(@RequestBody List<Category> categories) {
        try {
            return new ResponseEntity<>(categoryService.addCategories(categories), HttpStatus.CREATED);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateCategory(@RequestParam(value = "category-id") ObjectId categoryId, @RequestBody String category) {
        try {
            return new ResponseEntity<>(categoryService.updateCategory(categoryId, category), HttpStatus.OK);
        } catch (NoSuchElementException ex) {
            log.error(ex.getMessage());
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("all")
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        try {
            return new ResponseEntity<>(categoryService.getAllCategories(), HttpStatus.OK);
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping
    public ResponseEntity<String> deleteCategory(ObjectId categoryID) {
        try {
            return new ResponseEntity<>(categoryService.deleteCategory(categoryID), HttpStatus.NO_CONTENT);
        } catch (NoSuchElementException ex) {
            log.error(ex.getMessage());
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
