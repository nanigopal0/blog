package com.learning.api.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.learning.api.dto.*;
import com.learning.api.entity.AuthMode;
import org.springframework.data.domain.Page;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

public interface UserService {

    CurrentUserResponseDTO login(SignInRequestDTO signInRequest);

    String register(UserRegisterRequestDTO user, AuthMode authMode);

    UserDTO findUserByUsername(String username);

    UserDTO findUserById(Long id);

    CurrentUserResponseDTO findUserByEmail();

    CurrentUserResponseDTO updateUser(UpdateProfile user);

    void changePassword(UpdatePasswordDTO dto);

    void deleteUserById();

    void deleteUserById(Long id);

    List<UserDTO> findAllUser();

    Page<UserOverviewDTO> searchUsers(String name, String sortBy, String sortOrder, int pageNumber, int pageSize);

    void logout();

    CurrentUserResponseDTO generateJWTTokenAfterOAuth2Success(String token) throws JsonProcessingException,
            InvalidAlgorithmParameterException, NoSuchPaddingException, IllegalBlockSizeException,
            NoSuchAlgorithmException, BadPaddingException, InvalidKeyException;
}
