package com.boot.spring.blogify.exception;

public class UserAlreadyExistException extends RuntimeException {
    public UserAlreadyExistException(String message) {
        super("User already exist! " + message);
    }

}
