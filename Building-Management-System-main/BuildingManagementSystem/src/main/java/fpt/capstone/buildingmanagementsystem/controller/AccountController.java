package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.dto.RoleDto;
import fpt.capstone.buildingmanagementsystem.model.request.*;
import fpt.capstone.buildingmanagementsystem.model.response.AccountResponse;
import fpt.capstone.buildingmanagementsystem.model.response.JwtResponse;
import fpt.capstone.buildingmanagementsystem.security.JwtTokenUtil;
import fpt.capstone.buildingmanagementsystem.service.AccountManageService;
import fpt.capstone.buildingmanagementsystem.service.AuthenticateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class AccountController {
    @Autowired
    private AuthenticateService authenticationManager;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private AccountManageService accountManageService;

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<?> saveUser(@RequestBody RegisterRequest registerRequest) throws Exception {
        return accountManageService.saveNewAccount(registerRequest);
    }

    @RequestMapping(value = "/getAllAccount", method = RequestMethod.GET)
    public ResponseEntity<?> getAllAccount() throws Exception {
        return ResponseEntity.ok(accountManageService.getGetAllAccount());
    }

    @RequestMapping(value = "/getRoleByUserId", method = RequestMethod.POST)
    public RoleDto getRoleByUserId(@RequestBody GetUserInfoRequest getUserInfoRequest) throws Exception {
        return accountManageService.getGettingRole2(getUserInfoRequest);
    }

    @RequestMapping(value = "/changeStatusAccount", method = RequestMethod.POST)
    public boolean changeStatusAccount(@RequestBody ChangeStatusAccountRequest changeStatusAccountRequest) throws Exception {
        return accountManageService.changeStatusAccount(changeStatusAccountRequest);
    }

    @RequestMapping(value = "/changeRoleAccount", method = RequestMethod.POST)
    public ResponseEntity<?> changeRoleAccount(@RequestBody ChangeRoleRequest changeRoleRequest) throws Exception {
        return accountManageService.changeRoleAccount(changeRoleRequest);
    }

    @RequestMapping(value = "/changePassword", method = RequestMethod.POST)
    public boolean changPassword(@RequestBody ChangePasswordRequest changePasswordRequest) throws Exception {
        return accountManageService.changePassword(changePasswordRequest);
    }

    @RequestMapping(value = "/resetPassword", method = RequestMethod.POST)
    public boolean resetPassword(@RequestBody ResetPasswordRequest resetPassword) throws Exception {
        return accountManageService.resetPassword(resetPassword);
    }

    @RequestMapping(value = "/deleteAccount", method = RequestMethod.POST)
    public boolean deleteAccount(@RequestBody DeleteAccount deleteAccount) throws Exception {
        return accountManageService.deleteAccount(deleteAccount.getUsername(), deleteAccount.getHrId());
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<?> createAuthenticationToken(@RequestBody LoginRequest authenticationRequest) throws Exception {
        JwtResponse jwtResponse = new JwtResponse();
        if (accountManageService.checkUsernameAndPassword(authenticationRequest.getUsername(), authenticationRequest.getPassword())) {
            authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
            final UserDetails userDetails = accountManageService.loadUserByUsername(authenticationRequest.getUsername());
            final String token = jwtTokenUtil.generateToken(userDetails);
            RoleDto role = accountManageService.getGettingRole(authenticationRequest.getUsername());
            String userId = accountManageService.getAccountId(authenticationRequest.getUsername());
            jwtResponse = new JwtResponse(token, role.getRoleName(), userId);
        }
        return ResponseEntity.ok(jwtResponse);
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }

    @GetMapping("getCreatedDate")
    public AccountResponse getCreatedDate(@RequestParam("accountId") String accountId) {
        return accountManageService.getCreatedDate(accountId);
    }
}