package com.learning.api.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@Document(collection = "users")
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class User extends BaseUser {
    //    @DocumentReference(collection = "blogs",lazy = true)
//    @JsonManagedReference
//    @ToString.Exclude
//    private List<BlogData> blogs;
//    private List<ObjectId> blogIds;//
//    private List<ObjectId> commentIds;//
    private List<Interest> interests;
    private List<Follower> followers;
}
