package com.boot.spring.blogify.dto.auth;

public record ResetPasswordDTO(String email, String OTP, String newPassword) {
}
