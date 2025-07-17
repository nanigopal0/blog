package com.learning.api.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.learning.api.dto.BaseUserDTO;
import com.learning.api.dto.SignInRequestDTO;
import com.learning.api.entity.AuthMode;
import com.learning.api.entity.BaseUser;
import com.learning.api.entity.User;
import com.learning.api.exception.AESTokenException;
import com.learning.api.exception.UserAlreadyExistException;
import com.learning.api.jwt.JwtService;
import com.learning.api.service.UserService;
import com.learning.api.util.AESUtils;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/public")
@Slf4j
public class PublicController {


    private final UserService userService;


    public PublicController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("signup")
    public ResponseEntity<String> createUser(@RequestBody BaseUserDTO baseUserDTO) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(userService.register(baseUserDTO, AuthMode.EMAIL_PASSWORD));
        } catch (UserAlreadyExistException e) {
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(e.getMessage());
        } catch (Exception e) {
            log.error("signup: Invalid Credentials {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("login")
    public ResponseEntity<BaseUserDTO> login(@RequestBody SignInRequestDTO signInRequest) {
        try {
            return ResponseEntity.ok(userService.login(signInRequest));
        } catch (BadCredentialsException e) {
            log.error("login: Invalid Credentials ${}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/login/google")
    public ResponseEntity<String > loginGoogle(HttpServletResponse response) {
        try {
            response.sendRedirect("/oauth2/authorization/google");
            return ResponseEntity.ok("Redirected to Google OAuth2 Login");
        } catch (IOException e) {
            log.error("loginGoogle: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/oauth2-success/jwt-token")
    public ResponseEntity<BaseUserDTO> getJWTToken(@RequestParam(name = "token") String encodedToken) {
        try {
            return ResponseEntity.ok(userService.generateJWTTokenAfterOAuth2Success(encodedToken));
        }
        catch (JsonProcessingException e){
            log.error("getJWTToken: Bad format token: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        catch (AESTokenException | CredentialsExpiredException | BadCredentialsException e) {
            log.error("oauth2Success Invalid token: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (RuntimeException e) {
            log.error("oauth2Success: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
