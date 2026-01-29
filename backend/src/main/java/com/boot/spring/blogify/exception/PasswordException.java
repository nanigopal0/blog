package com.boot.spring.blogify.exception;

public class PasswordException extends RuntimeException {
    public PasswordException() {
        super("Invalid password format!");
    }

    public PasswordException(String message) {
        super(message);
    }
}
