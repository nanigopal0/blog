package com.boot.spring.blogify.configuration;

import com.boot.spring.blogify.dto.UserRegisterRequestDTO;
import com.boot.spring.blogify.entity.AuthMode;
import com.boot.spring.blogify.exception.UserAlreadyExistException;
import com.boot.spring.blogify.service.UserService;
import com.boot.spring.blogify.util.AESUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
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
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class Oauth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;

    public Oauth2LoginSuccessHandler(@Lazy UserService userService) {
        this.userService = userService;

    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {
        OAuth2User principal = (OAuth2User) authentication.getPrincipal();
        String name = principal.getAttribute("name");
        String picture = principal.getAttribute("picture");
        String email = principal.getAttribute("email");
        assert email != null;
        UserRegisterRequestDTO user = new UserRegisterRequestDTO();
        user.setPhoto(picture);
        user.setName(name);
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
            return;
        }

        /**
         * Generate a temporary token with encoded email id and short duration(15s). This should immediately
         * pass in the request body to get a jwt token.
         **/
        Map<String, String> data = new HashMap<>();
        data.put("email", email);
        data.put("issuedAt", String.valueOf(System.currentTimeMillis()));
        String token = null;
        try {
            token = AESUtils.encryptKey(new ObjectMapper().writeValueAsString(data));
        } catch (Exception e) {
            log.error("onAuthenticationSuccess: {}", e.getMessage());
            response.sendRedirect("https://blog-gama.vercel.app");
        }
        response.setStatus(HttpServletResponse.SC_OK);
        response.sendRedirect("https://blog-gama.vercel.app?token=" + token);
    }


}
