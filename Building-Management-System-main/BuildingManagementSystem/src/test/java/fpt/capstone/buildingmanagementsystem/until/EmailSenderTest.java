package fpt.capstone.buildingmanagementsystem.until;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.MockBeans;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.*;
@ExtendWith(SpringExtension.class)
@SpringBootTest
class EmailSenderTest {
    @Autowired
    JavaMailSender mailSender;

    @Value("${email.sender.from}")
    String fromEmail;

    @BeforeEach
    void setUp() {
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void testSetMailSender() {
        String toEmail = "sontung02hn@gmail.com";
        String subject = "Request attendance";
        String body = "facvfgdoabslgnlabgaljbgnfhlsnkon";

        SimpleMailMessage expectedMessage = new SimpleMailMessage();
        expectedMessage.setFrom("buildingmanagementsystem112@gmail.com");
        expectedMessage.setTo(toEmail);
        expectedMessage.setSubject(subject);
        expectedMessage.setText(body);

        mailSender.send(expectedMessage);
        assertEquals(fromEmail, expectedMessage.getFrom());






    }
}