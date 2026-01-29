package com.boot.spring.blogify.util;

import com.boot.spring.blogify.configuration.CustomUserDetails;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.lang.reflect.Field;
import java.util.Random;
import java.util.regex.Pattern;

public class GeneralMethod {

    private static final Random rand = new Random();
    private static final String PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!#%&*^?])[A-Za-z\\d@$!#%&*^?]{8,}$";

    private static final Pattern PASSWORD_PATTERN = Pattern.compile(PASSWORD_REGEX);

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
        Sort sort = Sort.unsorted();
        if (sortBy != null && sortOrder != null)
            sort = sortOrder.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return PageRequest.of(pageNumber, pageSize, sort);
    }

    public static CustomUserDetails getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof UsernamePasswordAuthenticationToken
                && authentication.getPrincipal() instanceof CustomUserDetails userDetails)
            return userDetails;
        throw new BadCredentialsException("Unable to get user details! Authentication is not type of UsernamePasswordAuthenticationToken");
    }

    public static Long findAuthenticatedUserId() {
        return getCurrentUser().getId();
    }


    public static boolean validatePassword(String password) {
        return PASSWORD_PATTERN.matcher(password).matches();
    }

    public static <T> void validateSortByType(String sortBy, Class<T> type) {
        for (Field f : type.getDeclaredFields())
            if (sortBy.equals(f.getName()))
                return;
        throw new IllegalArgumentException("Invalid sort by field: " + sortBy + " for class " + type.getSimpleName());
    }

}
