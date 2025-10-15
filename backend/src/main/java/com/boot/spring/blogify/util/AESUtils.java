package com.boot.spring.blogify.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.crypto.*;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;

public class AESUtils {
    private static final int KEY_SIZE_128 = 128; // AES key size in bits
    private static final int IV_SIZE = 16;       // AES/GCM recommended nonce (IV) size in bytes
    private static final int TAG_LENGTH_BITS = 128; // Authentication tag length in bits for GCM mode

    public static SecretKey generateKey() throws NoSuchAlgorithmException {
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(KEY_SIZE_128, new SecureRandom());
        return keyGen.generateKey();
    }

    public static byte[] generateNonce() {
        byte[] nonce = new byte[IV_SIZE];
        new SecureRandom().nextBytes(nonce); // Fill nonce with random bytes
        return nonce;
    }

    public static String encryptKey(String data)
            throws NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException,
            InvalidAlgorithmParameterException, InvalidKeyException, JsonProcessingException {
        SecretKey key = generateKey();
        byte[] iv = generateNonce();
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        GCMParameterSpec gcmParameterSpec = new GCMParameterSpec(TAG_LENGTH_BITS, iv);
        cipher.init(Cipher.ENCRYPT_MODE, key, gcmParameterSpec);
        byte[] encryptedBytes = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));

        Map<String, String> map = new java.util.HashMap<>();
        String encryptedToken = Base64.getEncoder().encodeToString(encryptedBytes);
        map.put("encryptedToken", encryptedToken);
        map.put("key", Base64.getEncoder().encodeToString(key.getEncoded()));
        map.put("iv", Base64.getEncoder().encodeToString(iv));
        return Base64.getEncoder().encodeToString(new ObjectMapper().writeValueAsBytes(map));
    }


    public static String decryptKey(String encryptedData)
            throws NoSuchPaddingException, NoSuchAlgorithmException, JsonProcessingException,
            InvalidAlgorithmParameterException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        //decoded map data
        String decodedData = new String(Base64.getDecoder().decode(encryptedData), StandardCharsets.UTF_8);
        //get key, iv from map
        Map<String, String> map = new ObjectMapper().readValue(decodedData, new TypeReference<>() {
        });
        String encryptedToken = map.get("encryptedToken");
        String encodedKey = map.get("key");
        String encodedIV = map.get("iv");

        // Decode Base64 encoded key and IV
        byte[] keyBytes = Base64.getDecoder().decode(encodedKey);
        byte[] iv = Base64.getDecoder().decode(encodedIV);

        GCMParameterSpec gcmParameterSpec = new GCMParameterSpec(TAG_LENGTH_BITS, iv);
        SecretKey key = new SecretKeySpec(keyBytes, "AES");
        cipher.init(Cipher.DECRYPT_MODE, key, gcmParameterSpec);

        // Decode Base64 encoded encrypted text
        byte[] encryptedBytes = Base64.getDecoder().decode(encryptedToken);
        byte[] decryptedBytes = cipher.doFinal(encryptedBytes);

        return new String(decryptedBytes, StandardCharsets.UTF_8);
    }

}
