package com.boot.spring.blogify.jwt;

import com.boot.spring.blogify.configuration.CustomUserDetails;
import com.boot.spring.blogify.service.implementation.CustomUserDetailService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    private static final String SECRET = generateRandom();
    public static final long ACCESS_TOKEN_VALIDITY_IN_MINUTES = 15;
    private static final long REFRESH_TOKEN_VALIDITY_IN_DAYS = 7;
    private final CustomUserDetailService customUserDetailService;

    public JwtService(CustomUserDetailService customUserDetailService) {
        this.customUserDetailService = customUserDetailService;
    }

    public static String generateRandom() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }

    public String generateAccessToken(String username, String name, Long id, String role, String email) {
        Map<String, String> claims = new HashMap<>();
        claims.put("name", name);
        claims.put("id", id.toString());
        claims.put("role", role);
        claims.put("username", username);
        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(Date.from(Instant.now().plus(Duration.ofMinutes(ACCESS_TOKEN_VALIDITY_IN_MINUTES))))
                .signWith(generateKey())
                .compact();
    }

    public String generateRefreshToken(Long id, String role, String email, String username) {
        Map<String, String> claims = new HashMap<>();
        claims.put("id", id.toString());
        claims.put("role", role);
        claims.put("username", username);
        return Jwts.builder().claims(claims).subject(email).issuedAt(new Date())
                .expiration(Date.from(Instant.now().plus(Duration.ofDays(REFRESH_TOKEN_VALIDITY_IN_DAYS))))
                .signWith(generateKey())
                .compact();
    }


    private SecretKey generateKey() {
        byte[] decodeKey = Base64.getDecoder().decode(SECRET);
        return Keys.hmacShaKeyFor(decodeKey);
    }

    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(generateKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    public boolean isAccessTokenValid(String token) {
        return getClaims(token).getExpiration().after(new Date());
    }

    public String validateRefreshTokenAndGenerateAccessToken(String token) {
        Claims claims = getClaims(token);
        if (claims.getExpiration().after(new Date())) {
            String id = claims.get("id", String.class);
            String role = claims.get("role", String.class);
            String username = claims.get("username", String.class);
            CustomUserDetails userDetails = (CustomUserDetails) customUserDetailService.loadUserByUsername(claims.getSubject());
            if (token.equals(userDetails.getRefreshToken()) && String.valueOf(userDetails.getId()).equals(id) && userDetails.getRole().equals(role)
                    && userDetails.getUserName().equals(username))
                return generateAccessToken(username, userDetails.getFullName(), userDetails.getId(), role, claims.getSubject());
            else throw new BadCredentialsException("Invalid refresh token");
        } else throw new BadCredentialsException("Refresh token expired");
    }

}
