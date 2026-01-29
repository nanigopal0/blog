package com.boot.spring.blogify.dto.blog;

public record UpdateBlogRequest(String title, String content, String coverImage) {
}
