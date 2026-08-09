package com.dpproducts.backend.service.client;

import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    @Autowired
    private JavaMailSender mailSender;

    // Transient in-memory storage engine matching Emails to generated OTP strings
    private final ConcurrentHashMap<String, String> otpCache = new ConcurrentHashMap<>();

    // 1. Generation Engine: Builds and dispatches a 6-digit verification code
    // public void sendVerificationOtp(String destinationEmail) {
    //     String otp = String.format("%06d", new Random().nextInt(999999));
    //     otpCache.put(destinationEmail, otp);

    //     SimpleMailMessage message = new SimpleMailMessage();
    //     message.setTo(destinationEmail);
    //     message.setSubject("DP Products - Secure Account Activation OTP");
    //     message.setText("Welcome to DP Products! Your dynamic verification security key code is: " + otp 
    //                  + "\n\nThis security token will expire shortly. Please do not share this token.");
        
    //     mailSender.send(message);
    // }
        // 1. Generation Engine: Builds and dispatches a 6-digit verification code
    public void sendVerificationOtp(String destinationEmail) {
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        otpCache.put(destinationEmail, otp);

        SimpleMailMessage message = new SimpleMailMessage();
        
        // 💡 CRITICAL FIX: Explicitly declare your authenticating sender email address here!
        message.setFrom("priyankakommana05@gmail.com"); // 👈 Change this to your exact Gmail address
        message.setTo(destinationEmail);
        message.setSubject("DP Products - Secure Account Activation OTP");
        message.setText("Welcome to DP Products! Your dynamic verification security key code is: " + otp 
                     + "\n\nThis security token will expire shortly. Please do not share this token.");
        
        mailSender.send(message);
    }


    // 2. Validation Check: Confirms the user's input code matches our token registry
    public boolean verifyOtpToken(String email, String userInputOtp) {
        if (otpCache.containsKey(email) && otpCache.get(email).equals(userInputOtp)) {
            otpCache.remove(email); // Purge token immediately on clean compilation match
            return true;
        }
        return false;
    }

    // 3. Invoice Dispatcher: Sends transactional receipt summaries after successful pay authorizations
    // public void sendPaymentSuccessInvoice(String destinationEmail, String orderId, String subtotalPrice, String address) {
    //     SimpleMailMessage message = new SimpleMailMessage();
    //     message.setTo(destinationEmail);
    //     message.setSubject("DP Products - Order Confirmation Receipt [" + orderId + "]");
    //     message.setText("Thank you for shopping with us!\n\nYour transaction has been authorized successfully."
    //                  + "\nOrder Reference ID: " + orderId 
    //                  + "\nTotal Chargeable Settlement Amount: " + subtotalPrice
    //                  + "\nShipping Allocation Destination: " + address 
    //                  + "\n\nYour package has been fast-tracked to our shipping facility.");
        
    //     mailSender.send(message);
    // }
        // 3. Invoice Dispatcher: Sends transactional receipt summaries after successful pay authorizations
    public void sendPaymentSuccessInvoice(String destinationEmail, String orderId, String subtotalPrice, String address) {
        SimpleMailMessage message = new SimpleMailMessage();
        
        // 💡 FIX: Declare the sender address here as well!
        message.setFrom("priyankakommana05@gmail.com"); // 👈 Change this to your exact Gmail address
        message.setTo(destinationEmail);
        message.setSubject("DP Products - Order Confirmation Receipt [" + orderId + "]");
        message.setText("Thank you for shopping with us!\n\nYour transaction has been authorized successfully."
                     + "\nOrder Reference ID: " + orderId 
                     + "\nTotal Chargeable Settlement Amount: " + subtotalPrice
                     + "\nShipping Allocation Destination: " + address);
        
        mailSender.send(message);
    }

}
