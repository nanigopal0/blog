package com.learning.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlogDataDTO {
    private String id;
    private String title;
    private String coverImage;
    private String content;
    private CategoryDTO category;
    private String userId;
    private String userFullName;
    private String userPhoto;
    private String username;
    private LocalDateTime time;
    private BlogReactionResponseDTO reaction;
    private List<CommentDTO> comments;
}
