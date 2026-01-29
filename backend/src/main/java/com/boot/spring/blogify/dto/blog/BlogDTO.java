package com.boot.spring.blogify.dto.blog;

import com.boot.spring.blogify.dto.CategoryDTO;
import com.boot.spring.blogify.dto.user.UserOverviewDTO;

public record BlogDTO(
        BlogOverviewDTO blog,
        CategoryDTO category,
        UserOverviewDTO author,
        BlogReactionDTO reaction
) {

}
