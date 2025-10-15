package com.boot.spring.blogify.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResetPasswordDTO {
    private String email;
    private String OTP;
    private String password;
}
