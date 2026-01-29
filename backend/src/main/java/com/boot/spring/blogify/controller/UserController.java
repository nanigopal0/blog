package com.boot.spring.blogify.controller;

import com.boot.spring.blogify.dto.auth.AuthProviderDTO;
import com.boot.spring.blogify.dto.auth.DefaultAuthProvider;
import com.boot.spring.blogify.dto.user.*;
import com.boot.spring.blogify.entity.user.User;
import com.boot.spring.blogify.service.UserService;
import com.boot.spring.blogify.util.EntityToDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("user")
@Slf4j
public class UserController {

    private final UserService userService;
    private final EntityToDTO entityToDTO;

    public UserController(UserService userService, EntityToDTO entityToDTO) {
        this.userService = userService;
        this.entityToDTO = entityToDTO;
    }

    //Get current logged in user
    @GetMapping("get-current-user")
    public UserDTO getUser() {
        return userService.getCurrentUserInfo();
    }

    @GetMapping("get-basic-info")
    public BasicUserInfo getBasicInfo() {
        return userService.extractBasicInfo();
    }

    @GetMapping("get-by-username")
    public BasicUserInfo getUserByUsername(@RequestParam String username) {
        return userService.findUserByUsername(username);
    }

    @GetMapping("get-by-id")
    public BasicUserInfo getUserById(@RequestParam Long id) {
        User user = userService.findById(id);
        return entityToDTO.convertUserToBasicUserInfo(user);
    }

    //Only Admin can access this endpoint
    @GetMapping("get-all")
    public List<BasicUserInfo> getAllUser() {
        return userService.findAllUser();
    }

    @PutMapping("update-profile")
    public BasicUserInfo updateUserEntity(@RequestBody UpdateProfile dto) {
        return userService.updateUser(dto);
    }

    @PutMapping("change-password")
    public String changeUserPassword(@RequestBody UpdatePasswordDTO dto) {
        userService.changePassword(dto);
        return "Password changed successfully";
    }

    @PutMapping("change-email-otp")
    public String sendUpdateEmailOTP(@RequestBody UpdateEmailDTO dto) {
        userService.OTPForUpdateEmail(dto);
        return "OTP sent successfully. Verify OTP within 5 minutes";
    }

    @PutMapping("verify-update-email")
    public void verifyAndUpdateEmail(@RequestParam String otp) {
        userService.verifyAndUpdateEmail(otp);
    }

    @GetMapping("delete-user-otp")
    public String deleteUser() {
        userService.generateOTPForAccountDeletion();
        return "OTP sent successfully. Verify OTP within 5 minutes";
    }

    @DeleteMapping("verify-delete-user")
    public ResponseEntity<Void> verifyAndDeleteUser(@RequestParam String otp) {
        userService.verifyOTPAndDeleteUser(otp);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("search")
    public PagedModel<UserOverviewDTO> searchUser(
            @RequestParam("name") String search,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "name", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "asc", required = false) String sortDir
    ) {

        return userService.searchUsers(search, sortBy, sortDir, pageNumber, pageSize);
    }

    @PutMapping("set-password")
    public String setPassword(@RequestBody String password) {
        userService.setPassword(password);
        return "Password set successfully!";
    }

    @DeleteMapping("unlink-auth-provider")
    public String unlinkAuthProvider(@RequestParam Long authModeId) {
        userService.unlinkAuthProvider(authModeId);
        return "Unlinked successfully!";
    }

    @GetMapping("get-auth-providers")
    public List<AuthProviderDTO> getAllAuthProviders() {
        return userService.getAllLinkedAuthProvider();
    }

    @PutMapping("change-default-auth-provider")
    public String changeDefaultAuthProvider(@RequestParam Long authModeId) {
        userService.changeDefaultAuthMode(authModeId);
        return "Default auth provider changed successfully!";
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
