package com.boot.spring.blogify.configuration;

import com.boot.spring.blogify.dto.auth.DefaultAuthProvider;
import com.boot.spring.blogify.dto.auth.UserRegisterRequestDTO;
import com.boot.spring.blogify.jwt.JwtService;
import com.boot.spring.blogify.service.CookieService;
import com.boot.spring.blogify.service.UserService;
import io.jsonwebtoken.Claims;
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

@Slf4j
@Component
public class Oauth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtService jwtService;


    public Oauth2LoginSuccessHandler(@Lazy UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    /*
        1. Get info from authentication principal
        2. If user currently has an account (by accessing tokens) just link the existing user with the auth provider
            else register or login
        3. check if the user exists in the database by email,
            if exists login the user otherwise register the user
     */
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException {
        String accessToken = null;
        String refreshToken = null;

        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(CookieService.JWT_COOKIE_NAME))
                    accessToken = cookie.getValue();
                if (cookie.getName().equals(CookieService.REFRESH_TOKEN_COOKIE_NAME))
                    refreshToken = cookie.getValue();
                if (accessToken != null && refreshToken != null) break;
            }
        }

        // Get info
        OAuth2User principal = (OAuth2User) authentication.getPrincipal();
        String name = principal.getAttribute("name");
        String picture = principal.getAttribute("picture");
        String email = principal.getAttribute("email");
        String providerId = principal.getName();
        String error = null;

        //Linking OAuth2 with existing account
        if (accessToken != null && refreshToken != null) {
            try {
                Claims accessTokenClaims = jwtService.getClaims(accessToken);
                Long authenticatedUserId = Long.parseLong(accessTokenClaims.getSubject());
                userService.linkOAuth2(DefaultAuthProvider.GOOGLE, email, providerId, authenticatedUserId);
            } catch (Exception e) {
                log.error(e.getMessage());
                error = e.getMessage();
            }
        }

        // OAuth2 Login/Register
        else {
            try {
                //login
                if (userService.existsUserWithEmail(email)) {
                    userService.loginOAuth2(email, providerId, DefaultAuthProvider.GOOGLE);
                }
                //register
                else {
                    UserRegisterRequestDTO registerRequest = new UserRegisterRequestDTO();
                    registerRequest.setPhoto(picture);
                    registerRequest.setName(name);
                    registerRequest.setEmail(email);
                    userService.registerFromOAuth2(registerRequest, providerId, DefaultAuthProvider.GOOGLE);
                }
            } catch (Exception e) {
                log.error(e.getMessage());
                error = e.getMessage();
            }
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        if (error != null)
            response.sendRedirect("https://blog-gama.vercel.app?error=" + error);
//            response.sendRedirect("http://localhost:5173?error=" + error);
        else
//            response.sendRedirect("http://localhost:5173");
            response.sendRedirect("https://blog-gama.vercel.app");
    }

}
