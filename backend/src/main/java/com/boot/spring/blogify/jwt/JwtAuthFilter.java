package com.boot.spring.blogify.jwt;

import com.boot.spring.blogify.configuration.CustomUserDetails;
import com.boot.spring.blogify.dto.auth.Role;
import com.boot.spring.blogify.dto.user.BaseUser;
import com.boot.spring.blogify.service.CookieService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Configuration
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {


    private final JwtService jwtService;
    private final CookieService cookieService;

    public JwtAuthFilter(JwtService jwtService, CookieService cookieService) {
        this.jwtService = jwtService;
        this.cookieService = cookieService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String accessToken = null;
        String refreshToken = null;
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(CookieService.JWT_COOKIE_NAME)) accessToken = cookie.getValue();

                if (cookie.getName().equals(CookieService.REFRESH_TOKEN_COOKIE_NAME)) refreshToken = cookie.getValue();

                if (accessToken != null && refreshToken != null) break;
            }
        }
        try {
            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                //Get access token claims and refresh token claims from tokens
                Claims jwtClaims = null;
                Claims refreshTokenClaims = null;
                try {
                    if (accessToken != null) jwtClaims = jwtService.getClaims(accessToken);
                } catch (ExpiredJwtException e) {
                    log.error("Given jwt token is expired !! {}", e.getMessage());
                }

                try {
                    if (refreshToken != null) refreshTokenClaims = jwtService.getClaims(refreshToken);
                } catch (ExpiredJwtException e) {
                    log.error("Refresh token is expired !! {}", e.getMessage());
                }

                //If the access token is valid, get stored info from claims and using this build BaseUser
                //and authenticate with the access token
                if (jwtClaims != null ) {
                    String subject = jwtClaims.getSubject();
                    if (subject == null) throw new MalformedJwtException("Invalid access token! subject is null");

                    Long id = Long.parseLong(subject);
                    Role role = Role.valueOf(jwtClaims.get("role", String.class));
                    String username = jwtClaims.get("username", String.class);
                    String name = jwtClaims.get("name", String.class);
                    boolean userVerified = Boolean.parseBoolean(jwtClaims.get("verified", String.class));

                    BaseUser baseUser = new BaseUser(id, name, null, username, null, null, role, userVerified);
                    authenticateWithJWT(request, baseUser);
                }

                // Else if the refresh token is valid, generate a new access token from refresh token claims and get the BaseUser
                //which eventually authenticate with the token
                else if (refreshTokenClaims != null && jwtService.validateJwtClaimsAge(refreshTokenClaims)) {
                    BaseUser user = jwtService.generateAccessTokenFromRefreshTokenClaims(response, refreshTokenClaims, refreshToken);
                    authenticateWithJWT(request, user);
                }
            }

        } catch (IllegalArgumentException e) {
            log.error("Illegal Argument while fetching the username !! {}", e.getMessage());
            cookieService.deleteJWTFromCookie(response, CookieService.JWT_COOKIE_NAME);
            cookieService.deleteJWTFromCookie(response, CookieService.REFRESH_TOKEN_COOKIE_NAME);
        } catch (MalformedJwtException e) {
            log.error("Some changed has done in token !! Invalid Token {}", e.getMessage());
            cookieService.deleteJWTFromCookie(response, CookieService.JWT_COOKIE_NAME);
            cookieService.deleteJWTFromCookie(response, CookieService.REFRESH_TOKEN_COOKIE_NAME);
        } catch (Exception e) {
            log.error(e.getMessage());
            cookieService.deleteJWTFromCookie(response, CookieService.JWT_COOKIE_NAME);
            cookieService.deleteJWTFromCookie(response, CookieService.REFRESH_TOKEN_COOKIE_NAME);
        }

        try {
            filterChain.doFilter(request, response);
        } catch (RuntimeException e) {
            log.error(e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"RuntimeException\",\"message\":\"Unexpected error\"}");
        }

    }

    private void authenticateWithJWT(HttpServletRequest request, BaseUser user) {
        CustomUserDetails customUserDetails = CustomUserDetails.builder().user(user).build();
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
    }

}
