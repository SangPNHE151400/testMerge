package fpt.capstone.buildingmanagementsystem.until;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class EmailSender {
    @Value("${email.sender.from}")
    String fromEmail;
    @Autowired
    JavaMailSender mailSender;
    public void setMailSender(String toEmail, String subject, String body){
        SimpleMailMessage message= new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setText(body);
        message.setSubject(subject);
        mailSender.send(message);
    }
}
