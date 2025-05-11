package com.learning.api.entity;


import com.mongodb.lang.NonNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogData {
    @Id
    private String id;
    private String title;
    private String coverImage;
    private String content;
    @NonNull
    private String category;
    private LocalDateTime time;
    private String userId;
//    private User user;
    private int like;
    private List<String> comment;
}
