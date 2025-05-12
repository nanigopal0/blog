package com.learning.api.controller;

import com.learning.api.entity.Admin;
import com.learning.api.exception.UserNotFoundException;
import com.learning.api.service.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("admin")
@Slf4j
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("signup")
    public ResponseEntity<String> adminSignup(@RequestBody Admin admin) {
        try {
            adminService.addAdmin(admin);
            return ResponseEntity.status(HttpStatus.CREATED).body("Admin created successfully!");
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("login")
    public ResponseEntity<String> adminLogin(@RequestBody Admin admin) {
        try {
            adminService.login(admin);
            return ResponseEntity.ok("Admin logged in successfully!");
        } catch (UserNotFoundException e) {
            log.error(e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("get-admin")
    public ResponseEntity<Admin> getAdmin() {
        try {

            return ResponseEntity.ok(adminService.getAdmin());
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }


}
