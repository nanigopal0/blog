package com.boot.spring.blogify.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginResponse {
    private CurrentUserResponseDTO user;
    private String refreshToken;
}
