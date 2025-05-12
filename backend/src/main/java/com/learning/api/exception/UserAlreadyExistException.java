package com.learning.api.exception;

public class UserAlreadyExistException extends RuntimeException {
    public UserAlreadyExistException(String message) {
        super("User already exist! " + message);
    }

    public UserAlreadyExistException() {
        super("User already exist! ");
    }
}
