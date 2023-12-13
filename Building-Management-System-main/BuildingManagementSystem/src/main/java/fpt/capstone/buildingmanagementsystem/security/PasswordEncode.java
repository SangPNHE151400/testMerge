package fpt.capstone.buildingmanagementsystem.security;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
@Component
public class PasswordEncode {
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}