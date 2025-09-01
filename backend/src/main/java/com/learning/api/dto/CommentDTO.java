package com.learning.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentDTO {
    private Long id;
    private Long userId;
    private Long blogId;
    private LocalDateTime commentedAt;
    private String userFullName;    //commenter name
    private String userPhoto;       //commenter photo
    private String comment;
}
