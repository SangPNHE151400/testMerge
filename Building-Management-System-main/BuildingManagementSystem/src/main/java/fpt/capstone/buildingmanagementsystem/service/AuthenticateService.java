package fpt.capstone.buildingmanagementsystem.service;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
@Service
public class AuthenticateService implements AuthenticationManager {
    @Override
    public Authentication authenticate(Authentication auth) throws AuthenticationException {
        return new UsernamePasswordAuthenticationToken(auth.getPrincipal(), auth.getCredentials(),auth.getAuthorities());
    }
}
