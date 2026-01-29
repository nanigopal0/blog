package com.boot.spring.blogify.jwt;

import com.boot.spring.blogify.dto.user.BaseUser;
import com.boot.spring.blogify.entity.user.User;
import com.boot.spring.blogify.service.CookieService;
import com.boot.spring.blogify.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    //    private static final String SECRET = "generateRandom54843gkjskjj9349843kjldfsajkskjfkaKJJKDKF";
    public static final long ACCESS_TOKEN_VALIDITY_IN_MINUTES = 2;
    public static final long REFRESH_TOKEN_VALIDITY_IN_DAYS = 7;

    private final UserService userService;
    private final CookieService cookieService;
    private final SecretKey secretKey = Jwts.SIG.HS256.key().build();

    public JwtService(@Lazy UserService userService, CookieService cookieService) {
        this.userService = userService;
        this.cookieService = cookieService;
    }

    //user 'id' is the subject as it is permanent
    public String generateAccessToken(String username, String name, Long id, String role, boolean userVerified) {
        Map<String, String> claims = new HashMap<>();
        claims.put("name", name);
        claims.put("role", role);
        claims.put("username", username);
        claims.put("verified", String.valueOf(userVerified));
        return Jwts.builder()
                .claims(claims)
                .subject(id.toString())
                .issuedAt(new Date())
                .expiration(Date.from(Instant.now().plus(Duration.ofMinutes(ACCESS_TOKEN_VALIDITY_IN_MINUTES))))
                .signWith(secretKey)
                .compact();
    }

    //user 'id' is the subject as it is permanent
    public String generateRefreshToken(Long id, String role, String username, boolean userVerified) {
        Map<String, String> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("username", username);
        claims.put("verified", String.valueOf(userVerified));
        return Jwts.builder()
                .claims(claims)
                .subject(id.toString())
                .issuedAt(new Date())
                .expiration(Date.from(Instant.now().plus(Duration.ofDays(REFRESH_TOKEN_VALIDITY_IN_DAYS))))
                .signWith(secretKey)
                .compact();
    }

    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateJwtClaimsAge(Claims claims) {
        return claims.getExpiration().after(new Date());
    }

    /*
        1. Find user by email
        2. Match the refresh token with the database one
        3. Generated access token
        4. Add the access token to cookie
        5. Return the BaseUser
     */
    public BaseUser generateAccessTokenFromRefreshTokenClaims(HttpServletResponse response, Claims refreshTokenClaims, String refreshToken) {
        String sub = refreshTokenClaims.getSubject();
        if (sub == null) throw new MalformedJwtException("Invalid refresh token! Subject is null");
        Long id = Long.parseLong(sub);
        User user = userService.findById(id);
        if (user.getRefreshToken().equals(refreshToken)) {
            String accessToken = generateAccessToken(user.getUsername(), user.getName(), user.getId(), user.getRole().name(), user.isUserVerified());
            cookieService.addTokenToCookie(response, CookieService.JWT_COOKIE_NAME, accessToken, JwtService.ACCESS_TOKEN_VALIDITY_IN_MINUTES);

            return new BaseUser(user.getId(), user.getName(), user.getPhoto(), user.getUsername(), user.getEmail(),
                    null, user.getRole(), user.isUserVerified());
        } else throw new BadCredentialsException("Invalid refresh token");
    }
}
