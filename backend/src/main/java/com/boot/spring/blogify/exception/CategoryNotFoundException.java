package com.boot.spring.blogify.exception;

public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException(String message) {
        super("Category not found! " + message);
    }
}
