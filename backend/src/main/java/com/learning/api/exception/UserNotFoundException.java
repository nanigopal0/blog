package com.learning.api.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super("User not found! " + message);
    }

    public UserNotFoundException() {
        super("User not found!");
    }
}
