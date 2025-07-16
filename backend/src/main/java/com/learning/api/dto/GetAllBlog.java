package com.learning.api.dto;

import com.learning.api.entity.BlogData;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetAllBlog {

    private String userId;
    private String userName;
    private String userPhoto;
    private BlogData blog;
}
