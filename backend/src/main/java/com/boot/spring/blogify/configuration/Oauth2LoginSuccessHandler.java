package com.boot.spring.blogify.configuration;

import com.boot.spring.blogify.dto.CurrentUserResponseDTO;
import com.boot.spring.blogify.dto.UpdateProfile;
import com.boot.spring.blogify.dto.UserRegisterRequestDTO;
import com.boot.spring.blogify.entity.AuthMode;
import com.boot.spring.blogify.exception.UserAlreadyExistException;
import com.boot.spring.blogify.jwt.JwtService;
import com.boot.spring.blogify.service.CookieService;
import com.boot.spring.blogify.service.UserService;
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

@Slf4j
@Component
public class Oauth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;
    private final CookieService cookieService;
    private final JwtService jwtService;

    public Oauth2LoginSuccessHandler(@Lazy UserService userService, CookieService cookieService, JwtService jwtService) {
        this.userService = userService;
        this.cookieService = cookieService;
        this.jwtService = jwtService;
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
            CurrentUserResponseDTO dto = userService.updateUser(new UpdateProfile(name, picture, null));

            String accessToken = jwtService.generateAccessToken(dto.getUsername(), dto.getName(),
                    dto.getId(), dto.getRole().name(), email);
            cookieService.addTokenToCookie(response, accessToken);
            response.sendRedirect("https://blog-gama.vercel.app");
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
//        Map<String, String> data = new HashMap<>();
//        data.put("email", email);
//        data.put("issuedAt", String.valueOf(System.currentTimeMillis()));
//        String token = null;
//        try {
//            token = AESUtils.encryptKey(new ObjectMapper().writeValueAsString(data));
//        } catch (Exception e) {
//            log.error("onAuthenticationSuccess: {}", e.getMessage());
//            response.sendRedirect("https://blog-gama.vercel.app");
//        }
//        response.setStatus(HttpServletResponse.SC_OK);
//        response.sendRedirect("https://blog-gama.vercel.app?token=" + token);
//        response.sendRedirect("http://localhost:5173?token=" + token);
    }


}
