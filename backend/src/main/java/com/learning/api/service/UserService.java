package com.learning.api.service;

import com.learning.api.entity.User;
import com.learning.api.exception.UserNotFoundException;
import com.learning.api.repositories.BlogRepo;
import com.learning.api.repositories.UserRepo;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class UserService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final BlogRepo blogRepo;

    public UserService(UserRepo userRepo, PasswordEncoder passwordEncoder, BlogRepo blogRepo) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.blogRepo = blogRepo;
    }

    public User saveUser(User user) {
        if (isUserAuthenticated())
            return null;
        else {
            Optional<User> dbUser = userRepo.findByEmail(user.getEmail());
            if (dbUser.isPresent())
                return null;
            else {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                user.setBlogId(new ArrayList<>());
                return userRepo.save(user);
            }
        }
    }

    public User findUserByEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userRepo.findByEmail(authentication.getName()).orElseThrow(()->new UserNotFoundException(authentication.getName()));
    }

    public User updateUser(User updateUser) {
        if (!isUserAuthenticated())
            return null;
        else {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            Optional<User> dbUserOptional = userRepo.findByEmail(email);
            if (dbUserOptional.isPresent()) {
                User dbUser = dbUserOptional.get();
                if (updateUser.getName() != null)
                    dbUser.setName(updateUser.getName());
                if (updateUser.getPhoto() != null)
                    dbUser.setPhoto(updateUser.getPhoto());
                if (updateUser.getEmail() != null)
                    dbUser.setEmail(updateUser.getEmail());
                if (updateUser.getPassword() != null)
                    dbUser.setPassword(passwordEncoder.encode(updateUser.getPassword()));
                if (updateUser.getRoles() != null)
                    dbUser.setRoles(updateUser.getRoles());
                return userRepo.save(dbUser);
            } else return null;
        }
    }

    public boolean isUserAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() &&
                !(authentication instanceof AnonymousAuthenticationToken);
    }

    @Transactional
    public boolean deleteUserById() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User dbUser = userRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException(email));
        blogRepo.deleteAllById(dbUser.getBlogId());
        userRepo.deleteById(dbUser.getId());
        return true;

    }

    public List<User> findAllUser() {
        return userRepo.findAll();
    }

    public List<User> searchUsers(String name) throws Exception {
        try {
            List<User> users = userRepo.findAllByName(name);
            if (!users.isEmpty()) return users;
            else throw new Exception("Not found any user");
        } catch (Exception e) {
            throw new Exception("Not found any user");
        }
    }
}
