package com.boot.spring.blogify.service.implementation;

import com.boot.spring.blogify.entity.OTP;
import com.boot.spring.blogify.entity.Reason;
import com.boot.spring.blogify.repositories.OTPRepository;
import com.boot.spring.blogify.util.GeneralMethod;
import jakarta.mail.MessagingException;
import org.springframework.data.domain.Limit;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class OTPService {
    private final OTPRepository otpRepository;
    private final MailService mailService;
    private static final int OTP_EXPIRY_TIME_IN_MINUTES = 5;

    public OTPService(OTPRepository otpRepository, MailService mailService) {
        this.otpRepository = otpRepository;
        this.mailService = mailService;
    }

    public void generateOTP(Long userId,String userFullName,String email, Reason reason) {
        OTP otp = new OTP();
        otp.setOtp(String.valueOf(GeneralMethod.generateRandomNumber()));
        otp.setVerified(false);
        otp.setReason(reason);
        otp.setUserId(userId);
        otp.setCreatedAt(LocalDateTime.now());
        Map<String, Object> vars = Map.of("name", userFullName, "reason", generateOTPReason(reason), "otp", otp.getOtp());
        try {
            mailService.sendMimeMail(email, generateMailSubject(reason), vars);
            otpRepository.save(otp);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }

    }

    private String generateOTPReason(Reason reason) {
        switch (reason) {
            case DELETE_ACCOUNT -> {
                return "Delete Account";
            }
            case FORGOT_PASSWORD -> {
                return "Forgot Password";
            }
            case USER_VERIFICATION -> {
                return "User Verification";
            }
            case UPDATE_EMAIL -> {
                return "Update Email";
            }
            default -> {
                return "Unknown Reason";
            }
        }
    }

    private String generateMailSubject(Reason reason) {
        switch (reason) {
            case DELETE_ACCOUNT -> {
                return "Account Deletion Confirmation";
            }
            case FORGOT_PASSWORD -> {
                return "Forgot Password Confirmation";
            }
            case USER_VERIFICATION -> {
                return "User Verification Confirmation";
            }
            case UPDATE_EMAIL -> {
                return "Update Email Confirmation";
            }
            default -> {
                return "Unknown Reason";
            }
        }
    }

    public boolean verifyOTP(Long userId, String OTP, Reason reason) {
        OTP otp = otpRepository.findByUserIdAndReasonOrderByCreatedAtDesc(userId, reason, Limit.of(1)).orElseThrow();
        if (otp.isVerified()) throw new RuntimeException("OTP already verified!");
        if (otp.getCreatedAt().plusMinutes(OTP_EXPIRY_TIME_IN_MINUTES).isAfter(LocalDateTime.now()) &&
                otp.getOtp().equals(OTP)) {
            otp.setVerified(true);
            otpRepository.save(otp);
            return true;
        }
        return false;
    }
}
