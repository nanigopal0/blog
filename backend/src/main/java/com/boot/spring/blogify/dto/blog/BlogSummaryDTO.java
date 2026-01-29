package com.boot.spring.blogify.dto.blog;

import com.boot.spring.blogify.dto.CategoryDTO;
import com.boot.spring.blogify.dto.user.UserOverviewDTO;

public record BlogSummaryDTO(
        BlogOverviewDTO blog,
        CategoryDTO category,
        UserOverviewDTO author
) {
}
