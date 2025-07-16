package com.learning.api.util;

import java.util.Random;

public class GeneralMethod {

    //six digit random number generate
    public static int generateRandomNumber() {
        Random rand = new Random();
        return rand.nextInt(100000, 999999);
    }

    public static String generateUsername(String name) {
        name = name.replaceAll(" ", "");
        int endIdx = Math.min(name.length(), 5);
        return name.substring(0, endIdx).toLowerCase() + generateRandomNumber();
    }

}
