package com.learning.api.service.implement;

import com.learning.api.configuration.CustomUserDetails;
import com.learning.api.dto.BaseUserDTO;
import com.learning.api.dto.Role;
import com.learning.api.dto.SignInRequestDTO;
import com.learning.api.dto.UserDTO;
import com.learning.api.entity.AuthMode;
import com.learning.api.entity.BaseUser;
import com.learning.api.entity.User;
import com.learning.api.exception.UserAlreadyExistException;
import com.learning.api.exception.UserNotFoundException;
import com.learning.api.jwt.JwtService;
import com.learning.api.repositories.BlogRepo;
import com.learning.api.repositories.CommentRepo;
import com.learning.api.repositories.UserRepo;
import com.learning.api.service.AdminService;
import com.learning.api.service.CookieService;
import com.learning.api.service.UserService;
import com.learning.api.util.GeneralMethod;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Collections;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
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
    private final CookieService cookieService;

    public UserServiceImpl(UserRepo userRepo,
                           PasswordEncoder passwordEncoder,
                           BlogRepo blogRepo,
                           @Lazy AdminService adminService,
                           AuthenticationManager authenticationManager,
                           JwtService jwtService,
                           CommentRepo commentRepo,
                           HttpServletResponse response,
                           CookieService cookieService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.blogRepo = blogRepo;
        this.adminService = adminService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.commentRepo = commentRepo;
        this.response = response;
        this.cookieService = cookieService;
    }


    @Override
    public UserDTO findUserByEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return findUserByEmail(authentication.getName());
    }

    @Override
    public BaseUserDTO login(SignInRequestDTO signInRequest) {
        User loadedUser =userRepo.findByEmail(signInRequest.getEmail()).orElseThrow(() -> new UserNotFoundException(signInRequest.getEmail()));
        if(loadedUser.getAuthMode() == AuthMode.OAUTH2)
            throw new BadCredentialsException("Different authentication mode.Use OAuth2 provider to login!");
        Authentication authRequest = new UsernamePasswordAuthenticationToken(signInRequest.getEmail(), signInRequest.getPassword());
        Authentication authResponse = authenticationManager.authenticate(authRequest);
        if (authResponse.isAuthenticated()) {
            SecurityContextHolder.getContext().setAuthentication(authResponse);
            CustomUserDetails userDetails = (CustomUserDetails) authResponse.getPrincipal();
            String token = jwtService.generateToken(signInRequest.getEmail(), userDetails.getFullName(), userDetails.getId().toHexString(),
                    userDetails.getRole(), userDetails.getUsername());

            cookieService.addTokenToCookie(response, token);

            BaseUserDTO dto= BaseUserDTO.builder()
                    .role(Role.valueOf(userDetails.getRole()))
                    .photo(userDetails.getUserPhoto())
                    .id(userDetails.getId().toHexString())
                    .name(userDetails.getFullName())
                    .username(userDetails.getUserName())
                    .build();
            dto.setEmail(signInRequest.getEmail());
            return dto;
        } else throw new BadCredentialsException("Authentication failed");
    }

    @Override
    public String register(BaseUserDTO user, AuthMode authMode) {
        if (isUserAuthenticated())
            throw new UserAlreadyExistException(user.getEmail());
        Optional<User> dbUser = userRepo.findByEmail(user.getEmail());
        try {
            if (dbUser.isPresent() || adminService.findAdminByEmail(user.getEmail()) != null)
                throw new UserAlreadyExistException(user.getEmail());
        } catch (UserNotFoundException ignored) {
        }
        User newUser = new User();
        newUser.setAuthMode(authMode);
        newUser.setEmail(user.getEmail());
        newUser.setName(user.getName());
        newUser.setPhoto(user.getPhoto());
        if (authMode == AuthMode.EMAIL_PASSWORD)
            newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setUsername(GeneralMethod.generateUsername(user.getName()));
        newUser.setRole(Role.USER);
        userRepo.save(newUser);
        return newUser.getEmail() + " successfully registered!";
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
    public User updateUser(BaseUserDTO updateUser) {
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
                return userRepo.save(dbUser);
            } else
                return null;
        }
    }

    public boolean isUserAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && !(authentication instanceof AnonymousAuthenticationToken) && !(authentication instanceof OAuth2AuthenticationToken) && authentication.isAuthenticated();
    }

    @Transactional
    @Override
    public void deleteUserById() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User dbUser = userRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException(email));
        this.deleteUserById(dbUser.getId());
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
                throw new UserNotFoundException("Not found any user");
        } catch (Exception e) {
            log.error(e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    public void logout() {
        cookieService.deleteJWTFromCookie(response);
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
}
