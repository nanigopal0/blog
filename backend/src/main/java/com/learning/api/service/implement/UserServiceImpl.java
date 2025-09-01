package com.learning.api.service.implement;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.learning.api.configuration.CustomUserDetails;
import com.learning.api.dto.*;
import com.learning.api.entity.AuthMode;
import com.learning.api.entity.User;
import com.learning.api.exception.UserAlreadyExistException;
import com.learning.api.exception.UserNotFoundException;
import com.learning.api.jwt.JwtService;
import com.learning.api.repositories.UserRepo;
import com.learning.api.service.*;
import com.learning.api.util.AESUtils;
import com.learning.api.util.EntityToDTO;
import com.learning.api.util.GeneralMethod;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final AdminService adminService;
    private final BlogService blogService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CommentService commentService;
    private final HttpServletResponse response;
    private final CookieService cookieService;
    private final EntityToDTO entityToDTO;
    private final FollowerService followerService;
    private final BlogReactionService blogReactionService;

    public UserServiceImpl(
            UserRepo userRepo, PasswordEncoder passwordEncoder, BlogService blogService, @Lazy AdminService adminService,
            AuthenticationManager authenticationManager, JwtService jwtService, CommentService commentService,
            HttpServletResponse response, CookieService cookieService,
            EntityToDTO entityToDTO, FollowerService followerService, BlogReactionService blogReactionService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.blogService = blogService;
        this.adminService = adminService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.commentService = commentService;
        this.response = response;
        this.cookieService = cookieService;
        this.entityToDTO = entityToDTO;
        this.followerService = followerService;
        this.blogReactionService = blogReactionService;
    }


    @Override
    public CurrentUserResponseDTO findUserByEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepo.findByEmail(authentication.getName()).orElseThrow(() -> new UserNotFoundException(authentication.getName()));
        Long totalBlogs = blogService.countTotalBlogsByUserId(user.getId());
        Long totalFollower = followerService.getFollowerCount(user.getId());
        Long totalFollowing = followerService.getFollowingCount(user.getId());
        return entityToDTO.convertUserToCurrentUserResponseDTO(user, totalFollowing, totalFollower, totalBlogs);
    }

    @Override
    public CurrentUserResponseDTO login(SignInRequestDTO signInRequest) {
        User loadedUser = userRepo.findByEmail(signInRequest.getEmail()).orElseThrow(() -> new UserNotFoundException(signInRequest.getEmail()));
        if (loadedUser.getAuthMode() == AuthMode.OAUTH2)
            throw new BadCredentialsException("Different authentication mode.Use OAuth2 provider to login!");
        Authentication authRequest = new UsernamePasswordAuthenticationToken(signInRequest.getEmail(), signInRequest.getPassword());
        Authentication authResponse = authenticationManager.authenticate(authRequest);
        if (authResponse.isAuthenticated()) {
            CustomUserDetails userDetails = (CustomUserDetails) authResponse.getPrincipal();
            String token = jwtService.generateToken(userDetails.getUserName(), userDetails.getFullName(),
                    userDetails.getId(), userDetails.getRole(), userDetails.getUsername());

            cookieService.addTokenToCookie(response, token);

            Long totalBlogs = blogService.countTotalBlogsByUserId(loadedUser.getId());
            Long totalFollower = followerService.getFollowerCount(loadedUser.getId());
            Long totalFollowing = followerService.getFollowingCount(loadedUser.getId());
            return entityToDTO.convertUserToCurrentUserResponseDTO(loadedUser, totalFollowing, totalFollower, totalBlogs);
        } else throw new BadCredentialsException("Authentication failed");
    }

    @Override
    public String register(UserRegisterRequestDTO user, AuthMode authMode) {
        if (isUserAuthenticated())
            throw new UserAlreadyExistException(user.getEmail());
        try {
            Optional<User> dbUser = userRepo.findByEmail(user.getEmail());
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
        User user = userRepo.findByUsername(username).orElseThrow(() -> new UserNotFoundException(username));
        Long totalBlogs = blogService.countTotalBlogsByUserId(user.getId());
        Long totalFollower = followerService.getFollowerCount(user.getId());
        Long totalFollowing = followerService.getFollowingCount(user.getId());
        return entityToDTO.convertUserToUserDTO(user, totalBlogs, totalFollowing, totalFollower);
    }

    @Override
    public UserDTO findUserById(Long id) {
        User user = userRepo.findById(id).orElseThrow(() -> new UserNotFoundException(" Id: " + id));
        Long totalBlogs = blogService.countTotalBlogsByUserId(user.getId());
        Long totalFollower = followerService.getFollowerCount(user.getId());
        Long totalFollowing = followerService.getFollowingCount(user.getId());
        return entityToDTO.convertUserToUserDTO(user, totalBlogs, totalFollowing, totalFollower);
    }

    @Override
    @Transactional
    public CurrentUserResponseDTO updateUser(UpdateProfile updateUser) {
        if (!isUserAuthenticated()) return null;
        User user = getUser();
        if (updateUser.name() != null && !updateUser.name().isEmpty())
            user.setName(updateUser.name());

        if (updateUser.photo() != null && !updateUser.photo().isEmpty())
            user.setPhoto(updateUser.photo());

        if (updateUser.email() != null && !updateUser.email().isEmpty())
            user.setEmail(updateUser.email());
        User updatedUser = userRepo.save(user);
        Long totalBlogs = blogService.countTotalBlogsByUserId(user.getId());
        Long totalFollower = followerService.getFollowerCount(user.getId());
        Long totalFollowing = followerService.getFollowingCount(user.getId());
        return entityToDTO.convertUserToCurrentUserResponseDTO(updatedUser, totalFollowing, totalFollower, totalBlogs);
    }

    @Override
    @Transactional
    public void changePassword(UpdatePasswordDTO dto) {
        User user = getUser();
        if (!passwordEncoder.matches(dto.oldPassword(), user.getPassword()))
            throw new BadCredentialsException("Current password is wrong!");
        user.setPassword(passwordEncoder.encode(dto.newPassword()));
        userRepo.save(user);
    }

    public User getUser() {
        CustomUserDetails currentUser = GeneralMethod.getCurrentUser();
        return userRepo.findById(currentUser.getId()).orElseThrow(() -> new UserNotFoundException("Id: " + currentUser.getId()));
    }

    public boolean isUserAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && !(authentication instanceof AnonymousAuthenticationToken) &&
                !(authentication instanceof OAuth2AuthenticationToken) && authentication.isAuthenticated();
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
    public void deleteUserById(Long id) {
        userRepo.findById(id).orElseThrow(() -> new UserNotFoundException(" Id: " + id));
        blogReactionService.deleteAllBlogReactionsByUserId(id);
        followerService.deleteAllFollowersByUserId(id);
        followerService.deleteAllFollowingsByUserId(id);
        blogService.deleteAllBlogsByUserId(id);
        commentService.deleteAllCommentsByUserId(id);
        userRepo.deleteById(id);
    }

    @Override
    public List<UserDTO> findAllUser() {
        return userRepo.findAll().stream().map(user -> {
                    Long totalBlogs = blogService.countTotalBlogsByUserId(user.getId());
                    Long totalFollower = followerService.getFollowerCount(user.getId());
                    Long totalFollowing = followerService.getFollowingCount(user.getId());
                    return entityToDTO.convertUserToUserDTO(user, totalBlogs, totalFollowing, totalFollower);
                }
        ).toList();
    }


    @Override
    public Page<UserOverviewDTO> searchUsers(String name, String sortBy, String sortOrder, int pageNumber, int pageSize) {
        Pageable pageable = GeneralMethod.getPageable(sortBy, sortOrder, pageNumber, pageSize);
        return userRepo.findUsersByNameStartsWith(name, pageable);
    }


    @Override
    public void logout() {
        cookieService.deleteJWTFromCookie(response);
    }

    @Override
    public CurrentUserResponseDTO generateJWTTokenAfterOAuth2Success(String token) throws JsonProcessingException,
            InvalidAlgorithmParameterException, NoSuchPaddingException, IllegalBlockSizeException,
            NoSuchAlgorithmException, BadPaddingException, InvalidKeyException {

        String decryptedData = AESUtils.decryptKey(token);
        Map<String, String> data = new ObjectMapper().readValue(decryptedData, new TypeReference<>() {
        });
        String email = data.get("email");
        long issuedAt = Long.parseLong(data.get("issuedAt"));
        if (System.currentTimeMillis() - issuedAt > 15000) {
            throw new CredentialsExpiredException("Token expired!");
        }
        User user = userRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException(email));
        if (user.getEmail().equals(email)) {
            String jwtToken = jwtService.generateToken(user.getUsername(), user.getName(), user.getId(),
                    user.getRole().name(), user.getEmail());
            cookieService.addTokenToCookie(response, jwtToken);
            Long totalBlogs = blogService.countTotalBlogsByUserId(user.getId());
            Long totalFollower = followerService.getFollowerCount(user.getId());
            Long totalFollowing = followerService.getFollowingCount(user.getId());
            return entityToDTO.convertUserToCurrentUserResponseDTO(user, totalBlogs, totalFollowing, totalFollower);
        } else throw new BadCredentialsException("Email not match!");
    }

}
