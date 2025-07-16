package com.learning.api.service.implement;


import com.learning.api.configuration.CustomUserDetails;
import com.learning.api.dto.Role;
import com.learning.api.entity.Admin;
import com.learning.api.exception.UserAlreadyExistException;
import com.learning.api.exception.UserNotFoundException;
import com.learning.api.jwt.JwtService;
import com.learning.api.repositories.AdminRepo;
import com.learning.api.service.AdminService;
import com.learning.api.service.CookieService;
import com.learning.api.util.GeneralMethod;
import jakarta.servlet.http.HttpServletResponse;
import org.bson.types.ObjectId;
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

    public AdminServiceImpl(PasswordEncoder passwordEncoder, AdminRepo adminRepo, JwtService jwtService, UserServiceImpl userServiceImpl, AuthenticationManager authenticationManager, HttpServletResponse response, CookieService cookieService, CookieService cookieService1) {
        this.passwordEncoder = passwordEncoder;
        this.adminRepo = adminRepo;
        this.jwtService = jwtService;
        this.userServiceImpl = userServiceImpl;
        this.authenticationManager = authenticationManager;
        this.response = response;
        this.cookieService = cookieService1;
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
            else throw new UserNotFoundException();
        } catch (UserNotFoundException e) {
            try {
                adminRepo.save(admin);
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
        }
    }

    @Override
    public String updateAdmin(Admin admin) {
        return adminRepo.save(admin).getEmail();
    }

    @Override
    public void deleteAdmin(ObjectId id) {
        adminRepo.deleteById(id);
    }

    @Override
    public Admin findAdminById(ObjectId id) {
        return adminRepo.findById(id).orElseThrow(() -> new UserNotFoundException(id.toHexString()));
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
        SecurityContextHolder.getContext().setAuthentication(auth);
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        String token = jwtService.generateToken(userDetails.getUserName(), userDetails.getFullName(), userDetails.getId().toHexString(), userDetails.getRole(),
                userDetails.getUsername());
        cookieService.addTokenToCookie(response, token);
    }

    @Override
    public Admin getAdmin() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Optional<Admin> adminOptional = adminRepo.findByEmail(auth.getName());
            if (adminOptional.isEmpty())
                throw new UserNotFoundException("Admin " + auth.getName() + " does not exist!");
            return adminOptional.get();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
