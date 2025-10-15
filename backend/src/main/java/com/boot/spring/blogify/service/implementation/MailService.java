package com.boot.spring.blogify.service.implementation;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.UnsupportedEncodingException;
import java.util.Map;

@Service
public class MailService {

    private final JavaMailSender sender;
    private final SpringTemplateEngine templateEngine;

    @Value("$spring.mail.username")
    private String FROM;

    public MailService(JavaMailSender javaMailSender, SpringTemplateEngine templateEngine) {
        this.sender = javaMailSender;
        this.templateEngine = templateEngine;
    }

    public void sendSimpleMail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(FROM);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        sender.send(message);
    }

    public void sendMimeMail(String to, String subject, Map<String, Object> vars) throws MessagingException {
        MimeMessage message = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        try {
            helper.setFrom(FROM,"Blogify");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
        helper.setSubject(subject);
        helper.setTo(to);
        helper.setText(generateTemplateEngine(vars), true);
        sender.send(message);
    }

    public String generateTemplateEngine(Map<String, Object> vars) {
        Context context = new Context();
        context.setVariables(vars);
        return templateEngine.process("otp-email-template.html", context);
    }
}
