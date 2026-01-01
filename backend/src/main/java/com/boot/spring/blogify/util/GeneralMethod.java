package com.boot.spring.blogify.util;

import com.boot.spring.blogify.configuration.CustomUserDetails;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.util.matcher.RegexRequestMatcher;

import java.util.Random;
import java.util.regex.Pattern;

public class GeneralMethod {

    private static final Random rand = new Random();
    private static final String REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!#%&*^?])[A-Za-z\\d@$!#%&*^?]{8,}$";

    private static final Pattern PATTERN = Pattern.compile(REGEX);

    //six digit random number generate
    public static int generateRandomNumber() {
        return rand.nextInt(100000, 999999);
    }

    public static String generateUsername(String name) {
        name = name.replaceAll(" ", "");
        int endIdx = Math.min(name.length(), 5);
        return name.substring(0, endIdx).toLowerCase() + generateRandomNumber();
    }

    public static Pageable getPageable(String sortBy, String sortOrder, int pageNumber, int pageSize) {
        Sort sort = sortOrder.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return PageRequest.of(pageNumber, pageSize, sort);
    }

    public static CustomUserDetails getCurrentUser() {
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public static boolean validatePassword(String password){
        return PATTERN.matcher(password).matches();
    }

}
