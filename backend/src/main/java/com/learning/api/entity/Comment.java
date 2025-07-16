package com.learning.api.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.IndexDirection;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Document(collection = "comments")
public class Comment {
    //    @DocumentReference(collection = "users")
//    private User user;
    @Id
    private ObjectId commentId;
    @Indexed
    private ObjectId userId;
    @Indexed
    private ObjectId blogId;
    private String comment;
    //    private int likes;
//    private String userFullName;
//    private String userPhoto;
    @Indexed(direction = IndexDirection.DESCENDING)
    private LocalDateTime commentedAt;
}
