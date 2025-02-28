package com.lerning.api.service;

import com.lerning.api.entity.User;
import com.lerning.api.repositories.BlogRepo;
import com.lerning.api.repositories.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private BlogRepo blogRepo;

    public User saveUser(User user) {
        if (isUserAuthenticated())
            return null;
        else {
            Optional<User> dbUser = userRepo.findByEmail(user.getEmail());
            if (dbUser.isPresent())
                return null;
            else {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                user.setBlogs(new ArrayList<>());
                return userRepo.save(user);
            }
        }
    }

    public Optional<User> findUserByEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userRepo.findByEmail(authentication.getName());
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
                if (updateUser.getName() != null) {
                    dbUser.setName(updateUser.getName());
                }
                if (updateUser.getPhoto() != null) {
                    dbUser.setPhoto(updateUser.getPhoto());
                }
                if (updateUser.getEmail() != null)
                    dbUser.setEmail(updateUser.getEmail());
                if (updateUser.getPassword() != null)
                    dbUser.setPassword(passwordEncoder.encode(updateUser.getPassword()));
                if (updateUser.getRoles() != null)
                    dbUser.setRoles(updateUser.getRoles());
                return userRepo.save(dbUser);
            } else
                return null;
        }
    }

    public boolean isUserAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() &&
                !(authentication instanceof AnonymousAuthenticationToken);
    }

    public boolean deleteUserById() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        // System.out.println((UserDetails) authentication.getPrincipal());
        User dbUser = userRepo.findByEmail(email).get();
        blogRepo.deleteAllById(dbUser.getBlogs().stream().map(b -> b.getId()).collect(Collectors.toList()));
        userRepo.deleteById(dbUser.getId());
        return true;

    }

    public List<User> findAllUser() {
        return userRepo.findAll();
    }

    public List<User> searchUsers(String name) throws Exception {
        try {
            List<User> users = userRepo.findAllByName(name).get();
            if (!users.isEmpty())
                return users;
            else
                throw new Exception("Not found any user");
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception("Not found any user");
        }
    }
}
