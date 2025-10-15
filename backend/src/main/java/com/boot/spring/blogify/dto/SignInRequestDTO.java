package com.boot.spring.blogify.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignInRequestDTO {
    private String email;
    private String password;
}
