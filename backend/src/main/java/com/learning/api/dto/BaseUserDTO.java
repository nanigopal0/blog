package com.learning.api.dto;

import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BaseUserDTO extends SignInRequestDTO {
    private String id;
    private String name;
    private String photo;
    private String username;
    private Role role;
}
