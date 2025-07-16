package com.learning.api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@Document(collection = "blog_reaction")
@AllArgsConstructor
@NoArgsConstructor
@CompoundIndex(def = "{'userId': 1, 'blogId': 1}", unique = true)
public class BlogReaction {
    private ObjectId id;
    private ObjectId userId;  //Which user likes
    private ObjectId blogId;  //Where the user likes
}

//userId and blogId both will not be same in two or more documents