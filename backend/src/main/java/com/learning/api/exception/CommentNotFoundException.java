package com.learning.api.exception;

public class CommentNotFoundException extends RuntimeException {
    public CommentNotFoundException() {
        super("Comment not found");
    }

    public CommentNotFoundException(String message) {
        super(message + " Comment not found");
    }
}
