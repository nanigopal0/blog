package com.learning.api.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.learning.api.dto.CurrentUserResponseDTO;
import com.learning.api.dto.SignInRequestDTO;
import com.learning.api.dto.UserRegisterRequestDTO;
import com.learning.api.entity.AuthMode;
import com.learning.api.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@RestController
@RequestMapping("/public")
@Slf4j
public class PublicController {


    private final UserService userService;


    public PublicController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("signup")
    public ResponseEntity<String> createUser(@RequestBody UserRegisterRequestDTO userResponseDTO) {

        return ResponseEntity.status(HttpStatus.CREATED).body(userService.register(userResponseDTO, AuthMode.EMAIL_PASSWORD));

    }

    @PostMapping("login")
    public ResponseEntity<CurrentUserResponseDTO> login(@RequestBody SignInRequestDTO signInRequest) {

        return ResponseEntity.ok(userService.login(signInRequest));

    }

    @GetMapping("/login/google")
    public ResponseEntity<String> loginGoogle(HttpServletResponse response) throws IOException {

        response.sendRedirect("/oauth2/authorization/google");
        return ResponseEntity.ok("Redirected to Google OAuth2 Login");

    }

    @GetMapping("/oauth2-success/jwt-token")
    public ResponseEntity<CurrentUserResponseDTO> getJWTToken(@RequestParam(name = "token") String encodedToken)
            throws JsonProcessingException, InvalidAlgorithmParameterException, NoSuchPaddingException,
            IllegalBlockSizeException, NoSuchAlgorithmException, BadPaddingException, InvalidKeyException {

        return ResponseEntity.ok(userService.generateJWTTokenAfterOAuth2Success(encodedToken));

    }
}
