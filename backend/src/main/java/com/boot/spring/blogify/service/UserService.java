package com.boot.spring.blogify.service;

import com.boot.spring.blogify.dto.auth.*;
import com.boot.spring.blogify.dto.user.*;
import com.boot.spring.blogify.entity.user.User;
import org.springframework.data.web.PagedModel;

import java.util.List;

public interface UserService {

    BasicUserInfo login(SignInRequestDTO signInRequest);

    void register(UserRegisterRequestDTO user);

    void registerFromOAuth2(UserRegisterRequestDTO user, String providerUserId, DefaultAuthProvider provider);

    void loginOAuth2(String email, String providerUserId, DefaultAuthProvider provider);

    void linkOAuth2(DefaultAuthProvider provider, String oAuthEmail, String providerUserId, Long id);

    void unlinkAuthProvider(Long authModeId);

    BasicUserInfo findUserByUsername(String username);

    User findById(Long id);

    BasicUserInfo updateUser(UpdateProfile user);

    void changePassword(UpdatePasswordDTO dto);

    List<BasicUserInfo> findAllUser();

    PagedModel<UserOverviewDTO> searchUsers(String name, String sortBy, String sortOrder, int pageNumber, int pageSize);

    User findUserByEmail(String email);

    void logout();

    boolean verifyUser(String otp,String email);

    void forgotPasswordOTP(String email);

    void resetPassword(ResetPasswordDTO dto);

    void generateOTPForAccountDeletion();

    void verifyOTPAndDeleteUser(String otp);

    void OTPForUpdateEmail(UpdateEmailDTO dto);

    boolean existsUserWithEmail(String email);

    void verifyAndUpdateEmail(String otp);

    BasicUserInfo extractBasicInfo();

    UserDTO getCurrentUserInfo();

    void setPassword(String password);

    List<AuthProviderDTO> getAllLinkedAuthProvider();

    void changeDefaultAuthMode(Long authModeId);
}
