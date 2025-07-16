package com.learning.api.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learning.api.dto.BaseUserDTO;
import com.learning.api.entity.AuthMode;
import com.learning.api.exception.UserAlreadyExistException;
import com.learning.api.jwt.JwtService;
import com.learning.api.service.CookieService;
import com.learning.api.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Slf4j
@Component
public class Oauth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtService jwtService;
    private final CookieService cookieService;

    public Oauth2LoginSuccessHandler(@Lazy UserService userService, JwtService jwtService, CookieService cookieService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.cookieService = cookieService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {
        OAuth2User principal = (OAuth2User) authentication.getPrincipal();
        String name = principal.getAttribute("name");
        String picture = principal.getAttribute("picture");
        String email = principal.getAttribute("email");
        assert email != null;
        BaseUserDTO user = BaseUserDTO.builder()
                .name(name)
                .photo(picture)
                .build();
        user.setEmail(email);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try {
            userService.register(user, AuthMode.OAUTH2);
        } catch (UserAlreadyExistException e) {
            log.debug("User already exist {}", e.getMessage());
        } catch (Exception e) {
            // Return an error response
            String redirectUrl = String.format(
                    "https://blog-gama.vercel.app?message=%s",
                    URLEncoder.encode("Error: " + e.getMessage(), StandardCharsets.UTF_8)
            );
            response.sendRedirect(redirectUrl);
        }


        BaseUserDTO result = userService.findUserByEmail(email);
        String token = jwtService.generateToken(result.getUsername(), result.getName(), result.getId(), result.getRole().name(), email);
        cookieService.addTokenToCookie(response, token);
        Cookie cookie = new Cookie("user", Base64.getEncoder().encodeToString(new ObjectMapper().writeValueAsString(result).getBytes(StandardCharsets.UTF_8)));

        cookie.setSecure(true);
        cookie.setPath("/");
        response.addCookie(cookie);
        response.sendRedirect("https://blog-gama.vercel.app/home");
    }
}
