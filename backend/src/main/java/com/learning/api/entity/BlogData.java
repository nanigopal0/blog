package com.learning.api.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.IndexDirection;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;


@Document(collection = "blogs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogData {
    @Id
    private ObjectId id;
    @Indexed
    private String title;
    private String coverImage;
    private String content;
    @NonNull
    @Indexed(direction = IndexDirection.ASCENDING)
    private ObjectId categoryId;
    @Indexed(direction = IndexDirection.DESCENDING)
    private LocalDateTime time;

    //    @DocumentReference(collection = "users")
//    @JsonBackReference
//    @ToString.Exclude
//    private User user;
    @Indexed(direction = IndexDirection.ASCENDING)
    private ObjectId userId;
//    private int likes;
//    private List<ObjectId> commentIds;//
}
