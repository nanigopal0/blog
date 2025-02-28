package com.lerning.api.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllBlog {

    private String userId;
    private String userName;
    private String userPhoto;
    private BlogData blog;
}
