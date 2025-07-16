package com.learning.api.service;

import com.learning.api.dto.BaseUserDTO;
import com.learning.api.dto.SignInRequestDTO;
import com.learning.api.dto.UserDTO;
import com.learning.api.entity.AuthMode;
import com.learning.api.entity.BaseUser;
import com.learning.api.entity.User;
import org.bson.types.ObjectId;

import java.util.List;

public interface UserService {

    BaseUserDTO login(SignInRequestDTO signInRequest);

    String register(BaseUserDTO user, AuthMode authMode);

    UserDTO findUserByUsername(String username);

    UserDTO findUserByEmail(String email);

    UserDTO findUserById(ObjectId id);

    UserDTO findUserByEmail();

    User updateUser(BaseUserDTO user);

    void deleteUserById();

    void deleteUserById(ObjectId id);

    List<User> findAllUser();

    List<User> searchUsers(String name) throws Exception;

    void logout();
}
