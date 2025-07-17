package com.learning.api.controller;

import com.learning.api.dto.BaseUserDTO;
import com.learning.api.dto.UserDTO;
import com.learning.api.entity.User;
import com.learning.api.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("get")
    public ResponseEntity<UserDTO> getUserByEmail() {
        try {
            return ResponseEntity.ok(userService.findUserByEmail());
        } catch (Exception e) {
            log.error("getUserByEmail: User not found! ${}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("get-all")
    public ResponseEntity<List<User>> getAllUser() {
        try {
            List<User> users = userService.findAllUser();
            return ResponseEntity.of(Optional.of(users));
        } catch (Exception e) {
            log.error("getAllUser: Users not found! ${}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
        @PutMapping("update")
        public ResponseEntity<User> updateUserEntity (@RequestBody BaseUserDTO dto){
            try {
                User updateUser = userService.updateUser(dto);
                return ResponseEntity.status(HttpStatusCode.valueOf(201)).body(updateUser);
            } catch (Exception e) {
                log.error("updateUser: Failed to update user! ${}", e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        @DeleteMapping("delete")
        public ResponseEntity<Void> deleteUser () {
            try {
                userService.deleteUserById();
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            } catch (Exception e) {
                log.error("deleteUser: Failed to delete user! ${}", e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        @GetMapping("search")
        public ResponseEntity<List<User>> searchUser (@RequestParam("name") String search){
            try {
                List<User> users = userService.searchUsers(search);
                return ResponseEntity.ok(users);
            } catch (Exception e) {
                log.error("searchUser: User not found! ${}", e.getMessage());
                return ResponseEntity.notFound().build();
            }
        }

        @GetMapping("logout")
        public ResponseEntity<String> logout () {
            userService.logout();
            return ResponseEntity.ok("Logout successful!");
        }

        @GetMapping("/ping")
        public ResponseEntity<String> ping () {
            try {
                return ResponseEntity.status(HttpStatus.OK).body("Ping successful!");
            } catch (Exception e) {
                log.error("ping: User not found! {}", e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
            }
        }

    }
