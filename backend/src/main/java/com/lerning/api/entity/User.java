package com.lerning.api.entity;

import com.mongodb.lang.NonNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import java.util.List;


@Data
@Document
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String id;
    private String name;
    private String photo;
    @NonNull
    @Indexed(unique = true)
    private String username;
    @NonNull
    @Indexed(unique = true)
    private String email;
    private String password;
    private String roles;   //Role of the user like USER, ADMIN
    @DocumentReference(collection = "blogData")
    private List<BlogData> blogs;
}
