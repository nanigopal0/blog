package com.learning.api.exception;

public class BlogNotFoundException extends RuntimeException {
    public BlogNotFoundException(String message) {
        super("Blog not found! " + message);
    }

    public BlogNotFoundException() {
        super("Blog not found!");
    }
}
