package com.learning.api.dto;

import com.learning.api.entity.BlogData;
import lombok.*;

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
