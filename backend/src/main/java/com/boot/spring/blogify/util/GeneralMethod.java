package com.boot.spring.blogify.util;

import com.boot.spring.blogify.configuration.CustomUserDetails;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Random;

public class GeneralMethod {

    private static final Random rand = new Random();

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

}
