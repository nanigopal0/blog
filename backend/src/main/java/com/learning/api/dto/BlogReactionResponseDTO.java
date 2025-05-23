package com.learning.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BlogReactionResponseDTO {
    private String reactionId;
    private Long totalLikes;
    private boolean isUserLiked;
}
