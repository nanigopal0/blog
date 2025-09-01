package com.learning.api.dto;

import java.time.LocalDateTime;


public interface BlogOverviewDTO {
    Long getId();

    String getTitle();

    String getCoverImage();

    String getContent();

    CategoryDTO getCategory();

    UserOverviewDTO getUser();

    //     String userFullName;
//     String userPhoto;
    LocalDateTime getTime();
}
