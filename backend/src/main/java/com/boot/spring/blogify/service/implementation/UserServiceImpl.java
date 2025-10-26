package com.boot.spring.blogify.service.implementation;

import com.boot.spring.blogify.configuration.CustomUserDetails;
import com.boot.spring.blogify.dto.*;
import com.boot.spring.blogify.entity.AuthMode;
import com.boot.spring.blogify.entity.Reason;
import com.boot.spring.blogify.entity.User;
import com.boot.spring.blogify.exception.UserAlreadyExistException;
import com.boot.spring.blogify.exception.UserNotFoundException;
import com.boot.spring.blogify.exception.UserNotVerifiedException;
import com.boot.spring.blogify.jwt.JwtService;
import com.boot.spring.blogify.repositories.UserRepo;
import com.boot.spring.blogify.service.*;
import com.boot.spring.blogify.util.AESUtils;
import com.boot.spring.blogify.util.EntityToDTO;
import com.boot.spring.blogify.util.GeneralMethod;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final OTPService otpService;

    public UserServiceImpl(
            UserRepo userRepo, PasswordEncoder passwordEncoder, BlogService blogService, @Lazy AdminService adminService,
            AuthenticationManager authenticationManager, JwtService jwtService, CommentService commentService,
            HttpServletResponse response, CookieService cookieService,
            EntityToDTO entityToDTO, FollowerService followerService, BlogReactionService blogReactionService, OTPService otpService) {
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
        this.otpService = otpService;
    }


    @Override
    public CurrentUserResponseDTO findUserByEmail() {
        CustomUserDetails currentUser = GeneralMethod.getCurrentUser();
        User user = userRepo.findByEmail(currentUser.getUsername()).orElseThrow(() -> new UserNotFoundException(currentUser.getUsername()));
        Long totalBlogs = blogService.countTotalBlogsByUserId(user.getId());
        Long totalFollower = followerService.getFollowerCount(user.getId());
        Long totalFollowing = followerService.getFollowingCount(user.getId());
        return entityToDTO.convertUserToCurrentUserResponseDTO(user, totalFollowing, totalFollower, totalBlogs);
    }

    @Override
    public LoginResponse login(SignInRequestDTO signInRequest) {
        User loadedUser = userRepo.findByEmail(signInRequest.getEmail()).orElseThrow(() -> new UserNotFoundException(signInRequest.getEmail()));
        if (!loadedUser.isUserVerified()) {
            otpService.generateOTP(loadedUser.getId(), loadedUser.getName(), loadedUser.getEmail(), Reason.USER_VERIFICATION);
            throw new UserNotVerifiedException(signInRequest.getEmail() + " is not verified yet! OTP sent to your email");
        }
        if (loadedUser.getAuthMode() == AuthMode.OAUTH2)
            throw new BadCredentialsException("Different authentication mode.Use OAuth2 provider to login!");
        Authentication authRequest = new UsernamePasswordAuthenticationToken(signInRequest.getEmail(), signInRequest.getPassword());
        Authentication authResponse = authenticationManager.authenticate(authRequest);
        if (authResponse.isAuthenticated()) {
            CustomUserDetails userDetails = (CustomUserDetails) authResponse.getPrincipal();
            String accessToken = jwtService.generateAccessToken(userDetails.getUserName(), userDetails.getFullName(),
                    userDetails.getId(), userDetails.getRole(), userDetails.getUsername());
            String refreshToken = jwtService.generateRefreshToken(userDetails.getId(), userDetails.getRole(),
                    userDetails.getUsername(), userDetails.getUserName());

            loadedUser.setRefreshToken(refreshToken);
            userRepo.save(loadedUser);
            cookieService.addTokenToCookie(response, accessToken);

            Long totalBlogs = blogService.countTotalBlogsByUserId(loadedUser.getId());
            Long totalFollower = followerService.getFollowerCount(loadedUser.getId());
            Long totalFollowing = followerService.getFollowingCount(loadedUser.getId());
            return LoginResponse.builder()
                    .user(entityToDTO.convertUserToCurrentUserResponseDTO(loadedUser, totalFollowing, totalFollower, totalBlogs))
                    .refreshToken(refreshToken)
                    .build();
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
        newUser.setUserVerified(authMode == AuthMode.OAUTH2);
        User savedUser = userRepo.save(newUser);
        if (authMode == AuthMode.EMAIL_PASSWORD)
            otpService.generateOTP(savedUser.getId(), savedUser.getName(), savedUser.getEmail(), Reason.USER_VERIFICATION);
        return newUser.getEmail() + " successfully registered! Verification code sent to your email";
    }

    @Transactional
    public boolean verifyUser(String email, String OTP) {
        User user = userRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException(email));
        if (otpService.verifyOTP(user.getId(), OTP, Reason.USER_VERIFICATION)) {
            user.setUserVerified(true);
            userRepo.save(user);
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public void forgotPasswordOTP(String email) {
        User user = userRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException(email));
        otpService.generateOTP(user.getId(), user.getName(), user.getEmail(), Reason.FORGOT_PASSWORD);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordDTO dto) {
        User user = userRepo.findByEmail(dto.getEmail()).orElseThrow(() -> new UserNotFoundException(dto.getEmail()));
        if (otpService.verifyOTP(user.getId(), dto.getOTP(), Reason.FORGOT_PASSWORD)) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
            userRepo.save(user);
        } else throw new BadCredentialsException("Invalid OTP");
    }

    @Override
    @Transactional
    public void generateOTPForAccountDeletion() {
        User user = getUser();
        otpService.generateOTP(user.getId(), user.getName(), user.getEmail(), Reason.DELETE_ACCOUNT);
    }

    @Override
    @Transactional
    public void verifyOTPAndDeleteUser(String otp) {
        User user = getUser();
        if (otpService.verifyOTP(user.getId(), otp, Reason.DELETE_ACCOUNT)) {
            deleteUserById(user.getId());
        } else throw new BadCredentialsException("Invalid OTP");
    }

    @Override
    public void updateEmailOtp(UpdateEmailDTO dto) {
        User user = getUser();
        if (passwordEncoder.matches(dto.password(), user.getPassword()) && dto.email().equals(user.getEmail())) {
            if (userRepo.existsUserByEmail(dto.newEmail())) throw new UserAlreadyExistException(dto.newEmail());
            otpService.generateOTP(user.getId(), user.getName(), user.getEmail(), Reason.UPDATE_EMAIL);
        } else throw new BadCredentialsException("Invalid credentials");
    }

    @Override
    @Transactional
    public void verifyAndUpdateEmail(EmailVerificationDTO dto) {
        if (userRepo.existsUserByEmail(dto.email())) throw new UserAlreadyExistException(dto.email());
        User user = getUser();
        if (otpService.verifyOTP(user.getId(), dto.OTP(), Reason.UPDATE_EMAIL)) {
            user.setEmail(dto.email());
            String token = jwtService.generateAccessToken(user.getUsername(), user.getName(),
                    user.getId(), user.getRole().name(), dto.email());
            cookieService.addTokenToCookie(response, token);
        } else throw new BadCredentialsException("Invalid OTP");
    }

    @Override
    public void generateAccessTokenFromRefreshToken(String refreshToken) {
        if (refreshToken == null) throw new BadCredentialsException("Refresh token is null");
        String accessToken = jwtService.validateRefreshTokenAndGenerateAccessToken(refreshToken);
        cookieService.addTokenToCookie(response, accessToken);
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


    private void deleteUserById(Long id) {
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
        User currentUser = getUser();
        currentUser.setRefreshToken(null);
        userRepo.save(currentUser);
        cookieService.deleteJWTFromCookie(response);
    }

    @Override
    public LoginResponse generateJWTTokenAfterOAuth2Success(String token) throws JsonProcessingException,
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
            String refreshToken = jwtService.generateRefreshToken(user.getId(), user.getRole().name(),
                    user.getEmail(), user.getUsername());
            user.setRefreshToken(refreshToken);
            userRepo.save(user);
            String jwtToken = jwtService.generateAccessToken(user.getUsername(), user.getName(), user.getId(),
                    user.getRole().name(), user.getEmail());
            cookieService.addTokenToCookie(response, jwtToken);
            Long totalBlogs = blogService.countTotalBlogsByUserId(user.getId());
            Long totalFollower = followerService.getFollowerCount(user.getId());
            Long totalFollowing = followerService.getFollowingCount(user.getId());
            return LoginResponse.builder().refreshToken(refreshToken)
                    .user(entityToDTO.convertUserToCurrentUserResponseDTO(user, totalBlogs, totalFollowing, totalFollower))
                    .build();
        } else throw new BadCredentialsException("Email not match!");
    }

}
