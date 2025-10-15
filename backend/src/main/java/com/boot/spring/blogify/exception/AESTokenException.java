package com.boot.spring.blogify.exception;

public class AESTokenException extends RuntimeException {
    public AESTokenException(String message) {
        super(message);
    }
}
