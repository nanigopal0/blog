package com.lerning.api.controller;

import com.lerning.api.entity.User;
import com.lerning.api.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/register")

public class RegisterController {


    private final UserService userService;

    Logger logger = LoggerFactory.getLogger(RegisterController.class);

    public RegisterController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("get")
    public ResponseEntity<User> getUserByEmail() {
        try {
            User user = userService.findUserByEmail().get();
            return ResponseEntity.of(Optional.of(user));
        } catch (Exception e) {
            logger.error("getUserByEmail: User not found! ${}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("get-all")
    public ResponseEntity<List<User>> getAllUser() {
        try {
            List<User> users = userService.findAllUser();
            return ResponseEntity.of(Optional.of(users));
        } catch (Exception e) {
            logger.error("getAllUser: Users not found! ${}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("update")
    public ResponseEntity<User> updateUserEntity(@RequestBody User entity) {
        try {
            User updateUser = userService.updateUser(entity);
            return ResponseEntity.status(HttpStatusCode.valueOf(201)).body(updateUser);
        } catch (Exception e) {
            logger.error("updateUser: Failed to update user! ${}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("delete")
    public ResponseEntity<Void> deleteUser() {
        try {
            boolean isDeleted = userService.deleteUserById();
            if (isDeleted) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            } else
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            logger.error("deleteUser: Failed to delete user! ${}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("search")
    public ResponseEntity<List<User>> searchUser(@RequestParam("name") String search) {
        try {
            List<User> users = userService.searchUsers(search);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            logger.error("searchUser: User not found! ${}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }


}
