package com.learning.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BaseUserDTO {
    private String id;
    private String name;
    private String photo;
    private String username;
    private String email;
    private Role role;
}
