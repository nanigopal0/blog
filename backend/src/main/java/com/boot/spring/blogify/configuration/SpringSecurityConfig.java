package com.boot.spring.blogify.configuration;

import com.boot.spring.blogify.jwt.JwtAuthEntryPoint;
import com.boot.spring.blogify.jwt.JwtAuthFilter;
import com.boot.spring.blogify.service.implementation.CustomUserDetailService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;


@Configuration
@EnableWebSecurity
public class SpringSecurityConfig {

    private final CustomUserDetailService customUserDetailService;
    private final Oauth2LoginSuccessHandler oauth2LoginHandler;
    private final JwtAuthFilter jwtAuthFilter;
    private final JwtAuthEntryPoint entryPoint;

    public SpringSecurityConfig(CustomUserDetailService customUserDetailService, Oauth2LoginSuccessHandler oauth2LoginHandler, JwtAuthFilter jwtAuthFilter, JwtAuthEntryPoint entryPoint) {
        this.customUserDetailService = customUserDetailService;
        this.oauth2LoginHandler = oauth2LoginHandler;
        this.jwtAuthFilter = jwtAuthFilter;
        this.entryPoint = entryPoint;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        httpSecurity.
                cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(registry ->
                        registry.requestMatchers("/public/**", "/admin/login", "/actuator/health").permitAll()
                                .requestMatchers("/user/get-oauth2", "/comment/**", "/blog/reaction/**",
                                        "/user/**", "/blog/**", "/category/all", "/category/search",
                                        "/follower/**").authenticated()
                                .requestMatchers("/**").hasRole("ADMIN")
                                .anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults())
                .oauth2Login(oauth2 -> oauth2.successHandler(oauth2LoginHandler))
                .exceptionHandling(ex -> ex.authenticationEntryPoint(entryPoint))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return httpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("https://blog-gama.vercel.app", "https://blog-abcs-projects-883dea03.vercel.app/", "https://blog-git-master-abcs-projects-883dea03.vercel.app/", "http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider(customUserDetailService);
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(daoAuthenticationProvider);
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
    
