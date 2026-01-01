package com.boot.spring.blogify.controller;

import com.boot.spring.blogify.dto.*;
import com.boot.spring.blogify.service.UserService;
import jakarta.annotation.security.RolesAllowed;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    //Get current logged in user
    @GetMapping("get-current-user")
    public ResponseEntity<CurrentUserResponseDTO> getUser() {
        return ResponseEntity.ok(userService.findUserByEmail());
    }

    @GetMapping("get-by-username")
    public ResponseEntity<UserDTO> getUserByUsername(@RequestParam String username) {
        return ResponseEntity.ok(userService.findUserByUsername(username));
    }

    @GetMapping("get-by-id")
    public ResponseEntity<UserDTO> getUserById(@RequestParam Long id) {
        return ResponseEntity.ok(userService.findUserById(id));
    }

    @GetMapping("get-all")
    @RolesAllowed("ADMIN")
    public ResponseEntity<List<CurrentUserResponseDTO>> getAllUser() {
        return ResponseEntity.ok(userService.findAllUser());
    }

    @PutMapping("update-profile")
    public ResponseEntity<CurrentUserResponseDTO> updateUserEntity(@RequestBody UpdateProfile dto) {
        CurrentUserResponseDTO updateUser = userService.updateUser(dto);
        return ResponseEntity.ok(updateUser);
    }

    @PutMapping("change-password")
    public String changeUserPassword(@RequestBody UpdatePasswordDTO dto) {
        userService.changePassword(dto);
        return "Password changed successfully";
    }

    @PostMapping("change-email-otp")
    public String sendUpdateEmailOTP(@RequestBody UpdateEmailDTO dto){
        userService.updateEmailOtp(dto);
        return "OTP sent successfully. Verify OTP within 5 minutes";
    }

    @PutMapping("verify-update-email")
    public ResponseEntity<Void> verifyAndUpdateEmail(@RequestBody EmailVerificationDTO dto){
        userService.verifyAndUpdateEmail(dto);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("delete-otp")
    public String deleteUser() {
        userService.generateOTPForAccountDeletion();
        return "OTP sent successfully. Verify OTP within 5 minutes";
    }

    @DeleteMapping("verify-delete-user")
    public ResponseEntity<Void> verifyAndDeleteUser(@RequestParam String otp){
        userService.verifyOTPAndDeleteUser(otp);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("search")
    public ResponseEntity<Page<UserOverviewDTO>> searchUser(
            @RequestParam("name") String search,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "name", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "asc", required = false) String sortDir
    ) {

        return ResponseEntity.ok(userService.searchUsers(search, sortBy, sortDir, pageNumber, pageSize));
    }

    @GetMapping("logout")
    public String logout() {
        userService.logout();
        return "Logout successful!";
    }

    @GetMapping("ping")
    public String ping() {
        return "Ping successful!";
    }

}
