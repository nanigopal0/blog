package com.boot.spring.blogify.service.implementation;

import com.boot.spring.blogify.dto.auth.*;
import com.boot.spring.blogify.dto.user.*;
import com.boot.spring.blogify.entity.auth.AuthMode;
import com.boot.spring.blogify.entity.auth.AuthProvider;
import com.boot.spring.blogify.entity.otp.OTP;
import com.boot.spring.blogify.entity.otp.Reason;
import com.boot.spring.blogify.entity.user.User;
import com.boot.spring.blogify.exception.PasswordException;
import com.boot.spring.blogify.exception.UserAlreadyExistException;
import com.boot.spring.blogify.exception.UserNotFoundException;
import com.boot.spring.blogify.jwt.JwtService;
import com.boot.spring.blogify.repositories.AuthModeRepo;
import com.boot.spring.blogify.repositories.AuthProviderRepo;
import com.boot.spring.blogify.repositories.UserRepo;
import com.boot.spring.blogify.service.AdminService;
import com.boot.spring.blogify.service.CookieService;
import com.boot.spring.blogify.service.UserService;
import com.boot.spring.blogify.util.EntityToDTO;
import com.boot.spring.blogify.util.GeneralMethod;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final AdminService adminService;
    private final JwtService jwtService;
    private final HttpServletResponse response;
    private final CookieService cookieService;
    private final EntityToDTO entityToDTO;
    private final OTPService otpService;
    private final AuthModeRepo authModeRepo;
    private final AuthProviderRepo authProviderRepo;

    public UserServiceImpl(
            UserRepo userRepo, PasswordEncoder passwordEncoder, @Lazy AdminService adminService,
            JwtService jwtService,
            HttpServletResponse response, CookieService cookieService,
            EntityToDTO entityToDTO,
            OTPService otpService, AuthModeRepo authModeRepo, AuthProviderRepo authProviderRepo) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.adminService = adminService;
        this.jwtService = jwtService;
        this.response = response;
        this.cookieService = cookieService;
        this.entityToDTO = entityToDTO;
        this.otpService = otpService;
        this.authModeRepo = authModeRepo;
        this.authProviderRepo = authProviderRepo;
    }


    @Override
    public User findUserByEmail(String email) {
        return userRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException(email));
    }

    @Override
    public User findById(Long id) {
        return userRepo.findById(id).orElseThrow(() -> new UserNotFoundException(" Id: " + id));
    }

    /*
        Only for Local authentication(Email, Password)
        1. Find user by email
        2. If found, check the user supports this authentication mode (Local)
            otherwise throw exception to a message different auth mode
        3. If supported match password
        4. Check if the user is verified otherwise send verification OTP
        5. If the user is verified, set an access token and refresh token in the cookie also in the database
            and return the user
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public BasicUserInfo login(SignInRequestDTO signInRequest) {
        // 1. Find user by email
        User loadedUser = findUserByEmail(signInRequest.getEmail());

        // 2. Check user has Local authentication mode
        List<AuthMode> authModes = authModeRepo.findAuthModesByUser_Id(loadedUser.getId()).stream().filter(authMode ->
                authMode.getProvider().getProviderName().equals(DefaultAuthProvider.LOCAL.name())
        ).toList();
        if (authModes.isEmpty())
            throw new BadCredentialsException("Different authentication mode.Use OAuth2 provider to login!");
        AuthMode authMode = authModes.getFirst();
        if (authMode.getProviderUserId() != null)
            throw new BadCredentialsException("Invalid authentication provider!");

        // 3. Match password
        if (!passwordEncoder.matches(signInRequest.getPassword(), loadedUser.getPassword()))
            throw new BadCredentialsException("Invalid credentials");

        // 4. Check user is verified
        if (!loadedUser.isUserVerified()) {
            otpService.generateOTP(loadedUser, loadedUser.getEmail(), Reason.USER_VERIFICATION);
            return null;
        }

        // 5. Send access token and refresh token in the cookie and return the user
        sendAndSaveToken(loadedUser);
        return new BasicUserInfo(loadedUser.getId(), loadedUser.getName(), loadedUser.getPhoto(), loadedUser.getRole().name(),
                loadedUser.isUserVerified(), loadedUser.getUsername(), loadedUser.getBio());
    }

    /*
        ** Only for Local authentication(Email, Password)
        1. Find by email if user exists throw UserAlreadyExistException
        2. Validate the password criteria and generate the username
        3. Create new user and store in users table
        4. Get all auth provider
        5. Store the user as Local authentication mode in auth_mode table
        6. Store the auth mode id into user table
        7. Send the verification OTP via email
     */
    @Override
    @Transactional
    public void register(UserRegisterRequestDTO user) {
        // 1. Find user by email
        try {
            Optional<User> dbUser = userRepo.findByEmail(user.getEmail());
            if (dbUser.isPresent() || adminService.findAdminByEmail(user.getEmail()) != null)
                throw new UserAlreadyExistException(user.getEmail());
        } catch (UserNotFoundException ignored) {
        }

        // 2. Validate password
        if (!GeneralMethod.validatePassword(user.getPassword()))
            throw new PasswordException();

        // 3. Create new user
        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setName(user.getName());
        newUser.setPhoto(user.getPhoto());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setUsername(GeneralMethod.generateUsername(user.getName()));
        newUser.setRole(Role.USER);

        User savedUser = userRepo.save(newUser);

        // 4. Get auth provider by name (LOCAL)
        authProviderRepo.findAuthProviderByProviderName(DefaultAuthProvider.LOCAL.name())
                .ifPresent(authProvider -> {
                    // 5. Store the user as Local authentication mode in auth_mode table
                    AuthMode authMode = new AuthMode();
                    authMode.setUser(savedUser);
                    authMode.setProvider(authProvider);
                    authMode.setLinkedAt(LocalDateTime.now());
                    AuthMode savedAuthMode = authModeRepo.save(authMode);

                    // 6. Store the auth mode id into user table
                    savedUser.setDefaultAuthMode(savedAuthMode);
                    userRepo.save(savedUser);
                });

        // 7. Ssend verification OTP via email
        otpService.generateOTP(savedUser, savedUser.getEmail(), Reason.USER_VERIFICATION);
    }

    /*
        ** Only for OAuth authentication(Google)
        1. Create new user and store in users table
        2. Get all auth provider
        3. Store the user as OAuth authentication mode (Google) in auth_mode table
        4. Store the auth mode id into user table
        5. Send the access token and refresh token into cookie
     */
    @Override
    @Transactional
    public void registerFromOAuth2(UserRegisterRequestDTO user, String providerUserId, DefaultAuthProvider provider) {
        // 1. Create new user
        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setName(user.getName());
        newUser.setPhoto(user.getPhoto());
        newUser.setUsername(GeneralMethod.generateUsername(user.getName()));
        newUser.setRole(Role.USER);
        newUser.setUserVerified(true);

        User savedUser = userRepo.save(newUser);

        // 2. Get auth provider by name
        AuthProvider authProvider = authProviderRepo.findAuthProviderByProviderName(provider.name())
                .orElseThrow(() -> new RuntimeException(provider.name() + " not found!"));

        // 3. Store the user as OAuth authentication mode in auth_mode table
        AuthMode authMode = new AuthMode();
        authMode.setUser(savedUser);
        authMode.setProvider(authProvider);
        authMode.setProviderUserId(providerUserId);
        authMode.setLinkedAt(LocalDateTime.now());
        AuthMode savedAuthMode = authModeRepo.save(authMode);

        // 4. Store the auth mode id into user table
        savedUser.setDefaultAuthMode(savedAuthMode);

        // 5. Send the access token and refresh token into cookie
        sendAndSaveToken(savedUser);
    }

    private void sendAndSaveToken(User user) {
        String accessToken = jwtService.generateAccessToken(user.getUsername(), user.getName(),
                user.getId(), user.getRole().name(), user.isUserVerified());
        String refreshToken = jwtService.generateRefreshToken(user.getId(), user.getRole().name(),
                user.getUsername(), user.isUserVerified());
        user.setRefreshToken(refreshToken);
        userRepo.save(user);
        cookieService.addTokenToCookie(response, CookieService.JWT_COOKIE_NAME, accessToken, JwtService.ACCESS_TOKEN_VALIDITY_IN_MINUTES);
        cookieService.addTokenToCookie(response, CookieService.REFRESH_TOKEN_COOKIE_NAME, refreshToken, JwtService.REFRESH_TOKEN_VALIDITY_IN_DAYS * 1440);
    }

    /*
        1. Find user by email
        2. If found, check the user supports this authentication mode (Google) and match the provider user id
        3. Set the access token and refresh token into cookie
     */
    @Override
    @Transactional
    public void loginOAuth2(String email, String providerUserId, DefaultAuthProvider provider) {
        // 1. Find user by email
        User user = findUserByEmail(email);

        // 2. Check the authentication mode
        List<AuthMode> authModes = authModeRepo.findAuthModesByUser_Id(user.getId()).stream().filter(authMode ->
                authMode.getProvider().getProviderName().equals(provider.name())).toList();
        if (authModes.isEmpty()) throw new BadCredentialsException("Different authentication provider!");

        AuthMode authMode = authModes.getFirst();

        //Update the provider user id as it does not have
        if (authMode.getProviderUserId() != null && authMode.getProviderUserId().equals(String.valueOf(user.getId()))) {
            authMode.setProviderUserId(providerUserId);
            authModeRepo.save(authMode);
        }
        if (authMode.getProviderUserId() != null && authMode.getProviderUserId().equals(providerUserId)) {
            sendAndSaveToken(user);
        } else throw new BadCredentialsException("Invalid credentials");

    }

    @Transactional
    @Override
    public void linkOAuth2(DefaultAuthProvider provider, String oAuthEmailId, String providerUserId, Long id) {
        User user = findById(id);
        if (!user.getEmail().equals(oAuthEmailId)) throw new RuntimeException("Email does not match");

        AuthProvider authProvider = authProviderRepo.findAuthProviderByProviderName(provider.name())
                .orElseThrow(() -> new RuntimeException(provider.name() + " not found!"));

        AuthMode authMode = new AuthMode();
        authMode.setUser(user);
        authMode.setProvider(authProvider);
        authMode.setProviderUserId(providerUserId);
        authMode.setLinkedAt(LocalDateTime.now());
        authModeRepo.save(authMode);
    }

    @Transactional
    @Override
    public void unlinkAuthProvider(Long authModeId) {
        Long userId = GeneralMethod.findAuthenticatedUserId();
        AuthMode authMode = authModeRepo.findById(authModeId)
                .orElseThrow(() -> new RuntimeException(authModeId + " not found!"));

        User user = findById(userId);
        if (user.getDefaultAuthMode() != null && user.getDefaultAuthMode().getId().equals(authMode.getId())) {
            throw new RuntimeException("Cannot unlink provider. It is the default authentication mode.");
        }

        String providerName = authMode.getProvider().getProviderName();
        if (providerName.equals(DefaultAuthProvider.LOCAL.name())) {
            user.setPassword(null);
            userRepo.save(user);
        }
        authModeRepo.delete(authMode);
    }

    @Transactional
    public boolean verifyUser(String OTP, String email) {
        User user = findUserByEmail(email);
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
        User user = findUserByEmail(email);
        otpService.generateOTP(user, user.getEmail(), Reason.FORGOT_PASSWORD);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordDTO dto) {
        User user = findUserByEmail(dto.email());
        if (!GeneralMethod.validatePassword(dto.newPassword())) throw new PasswordException();
        if (otpService.verifyOTP(user.getId(), dto.OTP(), Reason.FORGOT_PASSWORD)) {
            user.setPassword(passwordEncoder.encode(dto.newPassword()));
            userRepo.save(user);
        } else throw new BadCredentialsException("Invalid OTP");
    }

    @Override
    @Transactional
    public void generateOTPForAccountDeletion() {
        long id = GeneralMethod.findAuthenticatedUserId();
        User user = findById(id);
        otpService.generateOTP(user, user.getEmail(), Reason.DELETE_ACCOUNT);
    }

    @Override
    @Transactional
    public void verifyOTPAndDeleteUser(String otp) {
        long id = GeneralMethod.findAuthenticatedUserId();
        if (otpService.verifyOTP(id, otp, Reason.DELETE_ACCOUNT)) {
            deleteUserById(id);
            cookieService.deleteJWTFromCookie(response, CookieService.JWT_COOKIE_NAME);
            cookieService.deleteJWTFromCookie(response, CookieService.REFRESH_TOKEN_COOKIE_NAME);
        } else throw new BadCredentialsException("Invalid OTP");
    }

    @Override
    public boolean existsUserWithEmail(String email) {
        return userRepo.existsUserByEmail(email);
    }


    /*
    Issue - If user logged in through oauth provider, after changing email 2 different email ids will be there
     */
    @Override
    public void OTPForUpdateEmail(UpdateEmailDTO dto) {
        if (dto.password() == null) throw new PasswordException("Set password before updating email");
        long id = GeneralMethod.findAuthenticatedUserId();
        User user = findById(id);
        if (passwordEncoder.matches(dto.password(), user.getPassword()) && dto.email().equals(user.getEmail())) {
            if (existsUserWithEmail(dto.newEmail())) throw new UserAlreadyExistException(dto.newEmail());
            otpService.generateOTP(user, dto.newEmail(), Reason.UPDATE_EMAIL);
        } else throw new BadCredentialsException("Invalid credentials");
    }

    @Override
    @Transactional
    public void verifyAndUpdateEmail(String otp) {
        long id = GeneralMethod.findAuthenticatedUserId();
        User user = findById(id);
        if (otpService.verifyOTP(user.getId(), otp, Reason.UPDATE_EMAIL)) {
            OTP otpObj = otpService.getEmailFromOTPObj(user.getId(), Reason.UPDATE_EMAIL);
            // Check if the user has OAuth provider, if found delete them all and the user can login using only LOCAL provider
            authModeRepo.findAuthModesByUser_Id(id).stream().filter(authMode ->
                    !authMode.getProvider().getProviderName().equals(DefaultAuthProvider.LOCAL.name())
            ).forEach(authMode -> {
                if (user.getDefaultAuthMode() != null && user.getDefaultAuthMode().equals(authMode)) {
                    user.setDefaultAuthMode(null);
                }
                authModeRepo.delete(authMode);
            });

            user.setEmail(otpObj.getEmail());
            sendAndSaveToken(user);
        } else throw new BadCredentialsException("Invalid OTP");
    }

    @Override
    public BasicUserInfo extractBasicInfo() {
        Long authenticatedUserId = GeneralMethod.findAuthenticatedUserId();
        User user = findById(authenticatedUserId);
        return new BasicUserInfo(user.getId(), user.getName(),
                user.getPhoto(), user.getRole().name(), user.isUserVerified(), user.getUsername(), user.getBio());
    }

    @Override
    public UserDTO getCurrentUserInfo() {
        Long userId = GeneralMethod.findAuthenticatedUserId();
        return userRepo.findCurrentUserById(userId);
    }

    /*
        1. Find user by id
        2. If the user does not have LOCAL Auth Provider, then only proceed further
        3. If the password is null, then only set password otherwise already set password
     */
    @Override
    @Transactional
    public void setPassword(String password) {
        if (!GeneralMethod.validatePassword(password)) throw new PasswordException();
        Long userId = GeneralMethod.findAuthenticatedUserId();
        authModeRepo.findAuthModesByUser_Id(userId).forEach(authMode -> {
            if (authMode.getProvider().getProviderName().equals(DefaultAuthProvider.LOCAL.name()))
                throw new RuntimeException("Cannot set password for LOCAL authentication mode");
        });
        User user = findById(userId);
        if (user.getPassword() != null) throw new RuntimeException("Password already set");
        AuthProvider provider = authProviderRepo.findAuthProviderByProviderName(DefaultAuthProvider.LOCAL.name()).orElseThrow(() -> new RuntimeException("Local authentication provider not found"));
        user.setPassword(passwordEncoder.encode(password));
        AuthMode authMode = new AuthMode();
        authMode.setUser(user);
        authMode.setProvider(provider);
        authMode.setLinkedAt(LocalDateTime.now());
        authModeRepo.save(authMode);
        userRepo.save(user);
    }

    @Override
    public List<AuthProviderDTO> getAllLinkedAuthProvider() {
        Long userId = GeneralMethod.findAuthenticatedUserId();
        return authModeRepo.findAuthModesByUser_Id(userId)
                .stream().map(authMode -> {
                    AuthProvider provider = authMode.getProvider();
                    return new AuthProviderDTO(authMode.getId(), provider.getProviderName());
                }).toList();
    }

    @Transactional
    @Override
    public void changeDefaultAuthMode(Long authModeId) {
        Long userId = GeneralMethod.findAuthenticatedUserId();
        AuthMode authMode = authModeRepo.findById(authModeId).orElseThrow(() -> new NoSuchElementException("Invalid auth mode id"));
        if (!Objects.equals(authMode.getUser().getId(), userId)) throw new AccessDeniedException("Invalid user id");
        User user = findById(userId);
        user.setDefaultAuthMode(authMode);
        userRepo.save(user);
    }

    @Override
    public BasicUserInfo findUserByUsername(String username) {
        User user = userRepo.findByUsername(username).orElseThrow(() -> new UserNotFoundException(username));
        return entityToDTO.convertUserToBasicUserInfo(user);
    }

    @Override
    @Transactional
    public BasicUserInfo updateUser(UpdateProfile updateUser) {
        if (!isUserAuthenticated()) return null;
        long id = GeneralMethod.findAuthenticatedUserId();
        User user = findById(id);

        if (updateUser.name() != null && !updateUser.name().isEmpty())
            user.setName(updateUser.name());

        if (updateUser.photo() != null && !updateUser.photo().isEmpty())
            user.setPhoto(updateUser.photo());

        if (updateUser.bio() != null && !updateUser.bio().isEmpty())
            user.setBio(updateUser.bio());

        User updatedUser = userRepo.save(user);
        return entityToDTO.convertUserToBasicUserInfo(updatedUser);
    }

    @Override
    @Transactional
    public void changePassword(UpdatePasswordDTO dto) {
        if (!GeneralMethod.validatePassword(dto.newPassword()))
            throw new PasswordException();
        long id = GeneralMethod.findAuthenticatedUserId();
        User user = findById(id);
        if (user.getPassword() != null && !passwordEncoder.matches(dto.oldPassword(), user.getPassword()))
            throw new BadCredentialsException("Current password is wrong!");
        user.setPassword(passwordEncoder.encode(dto.newPassword()));
        userRepo.save(user);
    }

    @Override
    public List<BasicUserInfo> findAllUser() {
        return userRepo.findAll().stream().map(entityToDTO::convertUserToBasicUserInfo).toList();
    }

    @Override
    public PagedModel<UserOverviewDTO> searchUsers(String name, String sortBy, String sortOrder, int pageNumber, int pageSize) {
        GeneralMethod.validateSortByType(sortBy, User.class);
        Pageable pageable = GeneralMethod.getPageable(sortBy, sortOrder, pageNumber, pageSize);
        return new PagedModel<>(userRepo.findUsersByNameStartsWith(name, pageable));
    }


    @Override
    public void logout() {
        long id = GeneralMethod.findAuthenticatedUserId();
        User currentUser = findById(id);
        currentUser.setRefreshToken(null);
        userRepo.save(currentUser);
        cookieService.deleteJWTFromCookie(response, CookieService.JWT_COOKIE_NAME);
        cookieService.deleteJWTFromCookie(response, CookieService.REFRESH_TOKEN_COOKIE_NAME);
    }

    public boolean isUserAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && !(authentication instanceof AnonymousAuthenticationToken) &&
                authentication.isAuthenticated() && (authentication instanceof OAuth2AuthenticationToken ||
                authentication instanceof UsernamePasswordAuthenticationToken);
    }


    private void deleteUserById(Long id) {
        authModeRepo.deleteAuthModesByUserId(id);
        userRepo.deleteById(id);
    }
}
