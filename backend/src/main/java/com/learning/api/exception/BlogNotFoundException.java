package com.learning.api.exception;

public class BlogNotFoundException extends RuntimeException {
    public BlogNotFoundException() {
        super("Blog not found!");
    }
    public BlogNotFoundException(String message) {
        super(message+" Blog not found!");
    }
}
