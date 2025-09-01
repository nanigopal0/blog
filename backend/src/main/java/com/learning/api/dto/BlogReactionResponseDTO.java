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
    // Id of BlogReaction when the Current user likes
    private Long reactionId;
    private Long totalLikes;
}
