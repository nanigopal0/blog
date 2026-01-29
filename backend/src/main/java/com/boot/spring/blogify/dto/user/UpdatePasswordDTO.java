package com.boot.spring.blogify.dto.user;

public record UpdatePasswordDTO(String oldPassword, String newPassword) {
}
