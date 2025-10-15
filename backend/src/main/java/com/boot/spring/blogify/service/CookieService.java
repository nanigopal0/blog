package com.boot.spring.blogify.service;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class CookieService {


    public void deleteJWTFromCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0) // Set maxAge to 0 to remove the cookie
                .sameSite("None")
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public void addTokenToCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofHours(1).getSeconds())
                .sameSite("None")
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
