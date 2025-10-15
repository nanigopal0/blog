package com.boot.spring.blogify.exception;

public class CommentNotFoundException extends RuntimeException {
    public CommentNotFoundException() {
        super("Comment not found");
    }

    public CommentNotFoundException(String message) {
        super(message + " Comment not found");
    }
}
