package com.learning.api.service.implement;

import com.learning.api.configuration.CustomUserDetails;
import com.learning.api.dto.BaseUserDTO;
import com.learning.api.dto.Role;
import com.learning.api.dto.UserDTO;
import com.learning.api.entity.User;
import com.learning.api.exception.UserAlreadyExistException;
import com.learning.api.exception.UserNotFoundException;
import com.learning.api.jwt.JwtService;
import com.learning.api.repositories.BlogRepo;
import com.learning.api.repositories.CommentRepo;
import com.learning.api.repositories.UserRepo;
import com.learning.api.service.AdminService;
import com.learning.api.service.UserService;
import com.learning.api.util.GeneralMethod;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class UserServiceImpl implements UserService {


    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final BlogRepo blogRepo;
    private final AdminService adminService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CommentRepo commentRepo;
    private final HttpServletResponse response;

    public UserServiceImpl(UserRepo userRepo, PasswordEncoder passwordEncoder, BlogRepo blogRepo, @Lazy AdminService adminService, AuthenticationManager authenticationManager, JwtService jwtService, CommentRepo commentRepo, HttpServletResponse response) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.blogRepo = blogRepo;
        this.adminService = adminService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.commentRepo = commentRepo;
        this.response = response;
    }


    private UserDTO convertUserToUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId().toHexString());
        userDTO.setEmail(user.getEmail());
        userDTO.setUsername(user.getUsername());
        userDTO.setPhoto(user.getPhoto());
        userDTO.setName(user.getName());
        userDTO.setRole(user.getRole());
        return userDTO;
    }

    @Override
    public UserDTO findUserByEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return findUserByEmail(authentication.getName());
    }

    @Override
    public BaseUserDTO login(String email, String password) {
        Authentication authRequest = new UsernamePasswordAuthenticationToken(email, password);
        Authentication authResponse = authenticationManager.authenticate(authRequest);
        if (authResponse.isAuthenticated()) {
            SecurityContextHolder.getContext().setAuthentication(authResponse);
            System.out.println(authResponse);
            CustomUserDetails userDetails = (CustomUserDetails) authResponse.getPrincipal();
            String token = jwtService.generateToken(email, userDetails.getFullName(), userDetails.getId().toHexString(),
                    userDetails.getRole(), userDetails.getUsername());

            addTokenToCookie(response, token);

            return UserDTO.builder()
                    .role(Role.valueOf(userDetails.getRole()))
                    .photo(userDetails.getUserPhoto())
                    .id(userDetails.getId().toHexString())
                    .name(userDetails.getFullName())
                    .username(userDetails.getUserName())
                    .email(userDetails.getUsername())
                    .build();
        } else throw new RuntimeException("Authentication failed");
    }

    void addTokenToCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(15 * 60)
                .sameSite("None")
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    @Override
    public String register(User user) {
        if (isUserAuthenticated()) return null;
        Optional<User> dbUser = userRepo.findByEmail(user.getEmail());
        try {
            if (dbUser.isPresent() || adminService.findAdminByEmail(user.getEmail()) != null)
                throw new UserAlreadyExistException(user.getEmail());
        } catch (UserNotFoundException ignored) {
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setUsername(GeneralMethod.generateUsername(user.getName()));
        user.setRole(Role.USER);
        user = userRepo.save(user);
        return user.getEmail() + " successfully registered!";
    }

    @Override
    public UserDTO findUserByUsername(String username) {
        Optional<User> byUsername = userRepo.findByUsername(username);
        if (byUsername.isPresent())
            return convertUserToUserDTO(byUsername.get());
        else throw new UserNotFoundException(username);
    }

    @Override
    public UserDTO findUserByEmail(String email) {
        Optional<User> userOptional = userRepo.findByEmail(email);
        if (userOptional.isEmpty()) throw new UserNotFoundException();
        return convertUserToUserDTO(userOptional.get());
    }

    @Override
    public UserDTO findUserById(ObjectId id) {
        Optional<User> userOptional = userRepo.findById(id);
        if (userOptional.isEmpty()) throw new UserNotFoundException();
        return convertUserToUserDTO(userOptional.get());
    }

    @Override
    public User updateUser(User updateUser) {
        if (!isUserAuthenticated())
            return null;
        else {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            Optional<User> dbUserOptional = userRepo.findByEmail(email);
            if (dbUserOptional.isPresent()) {
                User dbUser = dbUserOptional.get();
                if (updateUser.getName() != null) {
                    dbUser.setName(updateUser.getName());
                }
                if (updateUser.getPhoto() != null) {
                    dbUser.setPhoto(updateUser.getPhoto());
                }
                dbUser.setEmail(updateUser.getEmail());
                if (updateUser.getPassword() != null)
                    dbUser.setPassword(passwordEncoder.encode(updateUser.getPassword()));
                if (updateUser.getRole() != null)
                    dbUser.setRole(updateUser.getRole());
                return userRepo.save(dbUser);
            } else
                return null;
        }
    }

    public boolean isUserAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() &&
                !(authentication instanceof AnonymousAuthenticationToken);
    }

    @Transactional
    @Override
    public void deleteUserById() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User dbUser = userRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException(email));
        deleteUserById(dbUser.getId());
    }

    @Transactional
    @Override
    public void deleteUserById(ObjectId id) {
        userRepo.findById(id).orElseThrow(() -> new UserNotFoundException(id.toHexString()));
        blogRepo.deleteAllByUserId(id);
        userRepo.deleteById(id);
        commentRepo.deleteAllByUserId(id);
    }

    @Override
    public List<User> findAllUser() {
        return userRepo.findAll();
    }

    @Override
    public List<User> searchUsers(String name) throws Exception {
        try {
            List<User> users = userRepo.findAllByName(name).orElseThrow(() -> new UserNotFoundException(name));
            if (!users.isEmpty())
                return users;
            else
                throw new Exception("Not found any user");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new Exception("Not found any user");
        }
    }

    @Override
    public void logout() {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0) // Set maxAge to 0 to remove the cookie
                .sameSite("None")
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
