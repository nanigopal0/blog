package com.learning.api.entity;

import com.learning.api.dto.Role;
import com.mongodb.lang.NonNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
@NoArgsConstructor
public class BaseUser {
    @Id
    private ObjectId id;
    private String name;
    private String photo;
    @NonNull
    @Indexed(unique = true)
    private String username;
    @NonNull
    @Indexed(unique = true)
    private String email;
    private String password;
    private Role role;   //Role of the user like USER, ADMIN
}
