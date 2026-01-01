package com.boot.spring.blogify.service;

import com.boot.spring.blogify.dto.*;
import com.boot.spring.blogify.entity.AuthMode;
import com.boot.spring.blogify.entity.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.data.domain.Page;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

public interface UserService {

    LoginResponse login(SignInRequestDTO signInRequest);

    String register(UserRegisterRequestDTO user, AuthMode authMode);

    UserDTO findUserByUsername(String username);

    UserDTO findUserById(Long id);

    CurrentUserResponseDTO findUserByEmail();

    CurrentUserResponseDTO updateUser(UpdateProfile user);

    void changePassword(UpdatePasswordDTO dto);

    List<CurrentUserResponseDTO> findAllUser();

    Page<UserOverviewDTO> searchUsers(String name, String sortBy, String sortOrder, int pageNumber, int pageSize);

    User findUserByEmail(String email);

    void logout();

    LoginResponse generateJWTTokenAfterOAuth2Success(String token) throws JsonProcessingException,
            InvalidAlgorithmParameterException, NoSuchPaddingException, IllegalBlockSizeException,
            NoSuchAlgorithmException, BadPaddingException, InvalidKeyException;

    boolean verifyUser(String email, String otp);

    void forgotPasswordOTP(String email);

    void resetPassword(ResetPasswordDTO dto);

    void generateOTPForAccountDeletion();

    void verifyOTPAndDeleteUser(String otp);

    void updateEmailOtp(UpdateEmailDTO dto);

    void verifyAndUpdateEmail(EmailVerificationDTO dto);

    void generateAccessTokenFromRefreshToken(String refreshToken);
}
