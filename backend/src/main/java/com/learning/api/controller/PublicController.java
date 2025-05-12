package com.learning.api.controller;

import com.learning.api.dto.BaseUserDTO;
import com.learning.api.entity.User;
import com.learning.api.exception.UserAlreadyExistException;
import com.learning.api.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public")
@Slf4j
public class PublicController {


    private final UserService userService;


    public PublicController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("signup")
    public ResponseEntity<String> createUser(@RequestBody User entity) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(userService.register(entity));
        } catch (UserAlreadyExistException e) {
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(e.getMessage());
        } catch (Exception e) {
            log.error("signup: Invalid Credentials {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("login")
    public ResponseEntity<BaseUserDTO> login(@RequestBody User entity) {
        try {
            return ResponseEntity.ok(userService.login(entity.getEmail(), entity.getPassword()));
        } catch (Exception e) {
            log.error("login: Invalid Credentials ${}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
