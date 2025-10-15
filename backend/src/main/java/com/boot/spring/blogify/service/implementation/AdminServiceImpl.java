package com.boot.spring.blogify.service.implementation;


import com.boot.spring.blogify.configuration.CustomUserDetails;
import com.boot.spring.blogify.dto.Role;
import com.boot.spring.blogify.entity.Admin;
import com.boot.spring.blogify.exception.UserAlreadyExistException;
import com.boot.spring.blogify.exception.UserNotFoundException;
import com.boot.spring.blogify.jwt.JwtService;
import com.boot.spring.blogify.repositories.AdminRepo;
import com.boot.spring.blogify.service.AdminService;
import com.boot.spring.blogify.service.CookieService;
import com.boot.spring.blogify.util.GeneralMethod;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {


    private final PasswordEncoder passwordEncoder;
    private final AdminRepo adminRepo;
    private final JwtService jwtService;
    private final UserServiceImpl userServiceImpl;
    private final AuthenticationManager authenticationManager;
    private final HttpServletResponse response;
    private final CookieService cookieService;

    public AdminServiceImpl(
            PasswordEncoder passwordEncoder, AdminRepo adminRepo, JwtService jwtService,
            UserServiceImpl userServiceImpl, AuthenticationManager authenticationManager,
            HttpServletResponse response, CookieService cookieService) {
        this.passwordEncoder = passwordEncoder;
        this.adminRepo = adminRepo;
        this.jwtService = jwtService;
        this.userServiceImpl = userServiceImpl;
        this.authenticationManager = authenticationManager;
        this.response = response;
        this.cookieService = cookieService;
    }

    @Override
    public void addAdmin(Admin admin) {
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin.setRole(Role.ADMIN);

        admin.setUsername(GeneralMethod.generateUsername(admin.getName()));
        Optional<Admin> adminOptional = adminRepo.findByEmail(admin.getEmail());
        try {
            if (adminOptional.isPresent() || userServiceImpl.findUserByEmail() != null)
                throw new UserAlreadyExistException("Admin " + admin.getEmail() + " already exist!");
        } catch (UserNotFoundException ignored) {
        }
        adminRepo.save(admin);
    }

    @Override
    public String updateAdmin(Admin admin) {
        return adminRepo.save(admin).getEmail();
    }

    @Override
    public void deleteAdmin(Long id) {
        adminRepo.deleteById(id);
    }

    @Override
    public Admin findAdminById(Long id) {
        return adminRepo.findById(id).orElseThrow(() -> new UserNotFoundException(" Id: " + id));
    }

    @Override
    public Admin findAdminByUsername(String username) {
        return adminRepo.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username));
    }

    @Override
    public Admin findAdminByEmail(String email) {
        return adminRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException(email));
    }

    @Override
    public List<Admin> findAllAdmins() {
        return adminRepo.findAll();
    }

    @Override
    public void login(Admin admin) {
        Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(admin.getEmail(), admin.getPassword()));
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        String token = jwtService.generateToken(userDetails.getUserName(), userDetails.getFullName(),
                userDetails.getId(), userDetails.getRole(), userDetails.getUsername());
        cookieService.addTokenToCookie(response, token);
    }

    @Override
    public Admin getAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return adminRepo.findByEmail(auth.getName()).orElseThrow(() -> new UserNotFoundException("Admin " + auth.getName() + " does not exist!"));
    }
}
