package com.boot.spring.blogify.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super("User not found! " + message);
    }

}
