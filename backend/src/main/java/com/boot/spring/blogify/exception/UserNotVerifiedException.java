package com.boot.spring.blogify.exception;

public class UserNotVerifiedException extends RuntimeException{

    public UserNotVerifiedException(String message) {
        super(message);
    }
}
