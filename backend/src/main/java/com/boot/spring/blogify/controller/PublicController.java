package com.boot.spring.blogify.controller;

import com.boot.spring.blogify.dto.auth.ResetPasswordDTO;
import com.boot.spring.blogify.dto.auth.SignInRequestDTO;
import com.boot.spring.blogify.dto.auth.UserRegisterRequestDTO;
import com.boot.spring.blogify.dto.user.BasicUserInfo;
import com.boot.spring.blogify.exception.UserNotVerifiedException;
import com.boot.spring.blogify.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/public")
@Slf4j
public class PublicController {

    private final UserService userService;

    public PublicController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("signup")
    public ResponseEntity<String> createUser(@RequestBody UserRegisterRequestDTO dto) {
        userService.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto.getEmail() + " registered successfully!");
    }

    @PostMapping("login")
    public ResponseEntity<BasicUserInfo> login(@RequestBody SignInRequestDTO signInRequest) {
        BasicUserInfo userInfo =userService.login(signInRequest);
        if (userInfo == null)
            throw new UserNotVerifiedException("You are not verified yet! OTP sent to your email");
        return ResponseEntity.ok(userInfo);
    }

    @GetMapping("/login/google")
    public ResponseEntity<String> loginGoogle(HttpServletResponse response) throws IOException {
        response.sendRedirect("/oauth2/authorization/google");
        return ResponseEntity.ok("Redirected to Google OAuth2 Login");
    }

    @PutMapping("/verify-email")
    public ResponseEntity<String> verifyUser(@RequestParam String otp,@RequestParam String email) {
        if (userService.verifyUser(otp,email)) return ResponseEntity.ok("User verified successfully");
        return ResponseEntity.badRequest().body("Invalid OTP");
    }

    @PostMapping("/send-forgot-password-otp")
    public ResponseEntity<String> generateForgotPasswordOTP(@RequestParam String email) {
        userService.forgotPasswordOTP(email);
        return ResponseEntity.ok("OTP generated successfully! Verify OTP within 5 minutes");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> verifyForgotPasswordAndResetPassword(@RequestBody ResetPasswordDTO dto) {
        userService.resetPassword(dto);
        return ResponseEntity.ok("Password reset successfully!");
    }

}
