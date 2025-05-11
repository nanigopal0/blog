package com.learning.api.exception;


public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message+" User not found!");
    }
}
