package com.learning.api.service;

import com.learning.api.dto.BaseUserDTO;
import com.learning.api.dto.UserDTO;
import com.learning.api.entity.User;
import jakarta.servlet.http.HttpServletResponse;
import org.bson.types.ObjectId;

import java.util.List;

public interface UserService {

    BaseUserDTO login(String username, String password);

    String register(User user);

    UserDTO findUserByUsername(String username);

    UserDTO findUserByEmail(String email);

    UserDTO findUserById(ObjectId id);

    UserDTO findUserByEmail();

    User updateUser(User user);

    void deleteUserById();

    void deleteUserById(ObjectId id);

    List<User> findAllUser();

    List<User> searchUsers(String name) throws Exception;

    void logout();
}
