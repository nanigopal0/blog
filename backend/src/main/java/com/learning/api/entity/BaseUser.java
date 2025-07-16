package com.learning.api.entity;

import com.fasterxml.jackson.databind.annotation.EnumNaming;
import com.learning.api.dto.Role;
import com.mongodb.lang.NonNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class BaseUser {
    @Id
    private ObjectId id;
    private String name;
    private String photo;
    private AuthMode authMode;
    @NonNull
    @Indexed(unique = true)
    private String username;
    @NonNull
    @Indexed(unique = true)
    private String email;
    private String password;
    private Role role;
}
