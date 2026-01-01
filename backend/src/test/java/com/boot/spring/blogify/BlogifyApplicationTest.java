package com.boot.spring.blogify;

import com.boot.spring.blogify.util.GeneralMethod;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.Arrays;


public class BlogifyApplicationTest {

    @Test
    void checkPasswordValidation() {
        String[] passwords = {"Test 123","Test@123", "12#fR$tl", "abcdefgh", "12345678", "ABCDEFGHI", "!@#$%^&*", "TeTst&@1234", "TsDjfodj", "Test@12",
                "TE123456", "TER@#!$%", "efjo4567", "oifs#@$%", "@#$%9493"};
        Boolean[] expected = {false,true, true, false, false, false, false, true, false, false, false, false, false, false, false};
        Boolean[] actual = Arrays.stream(passwords).map(GeneralMethod::validatePassword).toArray(Boolean[]::new);
        Assertions.assertArrayEquals(expected, actual);
    }
}
