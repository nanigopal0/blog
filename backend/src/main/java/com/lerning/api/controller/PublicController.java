package com.lerning.api.controller;

import com.lerning.api.entity.GetAllBlog;
import com.lerning.api.entity.User;
import com.lerning.api.jwt.JwtService;
import com.lerning.api.service.BlogService;
import com.lerning.api.service.CustomUserDetailService;
import com.lerning.api.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/public")

public class PublicController {


    private final UserService userService;
    private final BlogService blogService;
    private final JwtService jwtService;
    private final CustomUserDetailService userDetailService;
    private final AuthenticationManager authenticationManager;
    private final Logger logger = LoggerFactory.getLogger(PublicController.class);

    public PublicController(UserService userService, BlogService blogService, JwtService jwtService, CustomUserDetailService userDetailService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.blogService = blogService;
        this.jwtService = jwtService;
        this.userDetailService = userDetailService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("signup")
    public ResponseEntity<String> createUser(@RequestBody User entity) {
        try {
            User user = userService.saveUser(entity);
            if (user == null) return ResponseEntity.status(HttpStatus.FOUND).build();
            else {
                String token = jwtService.generateToken(userDetailService.loadUserByUsername(user.getEmail()));
                return ResponseEntity.status(HttpStatus.CREATED).body("Bearer " + token);
            }
        } catch (Exception e) {
            logger.error("signup: Invalid Credentials ${}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("login")
    public ResponseEntity<String> login(@RequestBody User entity) {
        try {
            Authentication authRequest = UsernamePasswordAuthenticationToken.unauthenticated(entity.getEmail(), entity.getPassword());
            Authentication authResponse = this.authenticationManager.authenticate(authRequest);
            if (authResponse.isAuthenticated()) {
                String token = jwtService.generateToken(userDetailService.loadUserByUsername(authResponse.getName()));
                return ResponseEntity.ok("Bearer " + token);
            } else return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        } catch (Exception e) {
            logger.error("login: Invalid Credentials ${}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("")
    public ResponseEntity<List<GetAllBlog>> searchBlogByCategory(@RequestBody String category) {
        try {
            return ResponseEntity.ok(blogService.searchByCategory(category));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
