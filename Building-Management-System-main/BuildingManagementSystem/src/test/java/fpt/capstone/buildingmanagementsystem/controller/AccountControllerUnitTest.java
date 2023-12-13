package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.ForbiddenError;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.exception.ServerError;
import fpt.capstone.buildingmanagementsystem.model.dto.RoleDto;
import fpt.capstone.buildingmanagementsystem.model.entity.Account;
import fpt.capstone.buildingmanagementsystem.model.request.*;
import fpt.capstone.buildingmanagementsystem.model.response.JwtResponse;
import fpt.capstone.buildingmanagementsystem.repository.AccountRepository;
import fpt.capstone.buildingmanagementsystem.security.JwtTokenUtil;
import fpt.capstone.buildingmanagementsystem.service.AccountManageService;
import fpt.capstone.buildingmanagementsystem.service.AuthenticateService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(SpringExtension.class)
@SpringBootTest
class AccountControllerUnitTest {

    @Autowired
    private AccountController accountController;

    @Autowired
    private AccountManageService accountManageService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private AuthenticateService authenticationManager;

    @Autowired
    private AccountRepository accountRepository;

    @BeforeEach
    public void setUp() {

        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateAuthenticationToken_Success() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("minhhaha");
        loginRequest.setPassword("123");

        ResponseEntity<?> response = accountController.createAuthenticationToken(loginRequest);

        JwtResponse jwtResponse = (JwtResponse) response.getBody();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("employee", jwtResponse.getRole());
        assertEquals("f8dbabf3-34d5-4b19-97dd-d99d7b34e11f", jwtResponse.getAccountId());
    }
    //note

    @Test
    public void testCreateAuthenticationToken_InvalidUsername() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("namnon123");
        loginRequest.setPassword("123");

        NotFound exception = org.junit.jupiter.api.Assertions.assertThrows(NotFound.class,
                () -> accountController.createAuthenticationToken(loginRequest));

        assertEquals("username_not_found", exception.getMessage());
    }

    @Test
    public void testCreateAuthenticationToken_InvalidPassword() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("namnon");
        loginRequest.setPassword("123234234234234234234234");

        BadRequest exception = assertThrows(BadRequest.class, () -> {
            accountController.createAuthenticationToken(loginRequest);
        });

        assertEquals("password_wrong", exception.getMessage());
    }

    @Test
    public void testCreateAuthenticationToken_AccountBlocked() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("namnontay");
        loginRequest.setPassword("123");

        ForbiddenError exception = assertThrows(ForbiddenError.class, () -> {
            accountController.createAuthenticationToken(loginRequest);
        });

        assertEquals("account_blocked", exception.getMessage());
    }

    //Test on server (mailsender fix)
    @Test
    public void testResetPassword_Success() throws Exception {
        ResetPasswordRequest resetPasswordRequest = new ResetPasswordRequest();
        resetPasswordRequest.setUsername("tungnshe");

        boolean result = accountController.resetPassword(resetPasswordRequest);


        assertTrue(result);
    }

    @Test
    public void testResetPassword_returnNotFound() throws Exception {
        ResetPasswordRequest resetPasswordRequest = new ResetPasswordRequest();
        resetPasswordRequest.setUsername("namnon123");

        NotFound exception = assertThrows(NotFound.class, () -> {
            accountController.resetPassword(resetPasswordRequest);
        });

        assertEquals("user_not_found", exception.getMessage());
    }

    @Test
    public void testResetPassword_returnBadRequest() throws Exception {
        ResetPasswordRequest resetPasswordRequest = new ResetPasswordRequest();
        resetPasswordRequest.setUsername(null);

        BadRequest exception = assertThrows(BadRequest.class, () -> {
            accountController.resetPassword(resetPasswordRequest);
        });

        assertEquals("request_fail", exception.getMessage());
    }

    @Test
    public void testChangePassword_Success() throws Exception {
        ChangePasswordRequest changePasswordRequest = new ChangePasswordRequest();
        changePasswordRequest.setAccountId("f8dbabf3-34d5-4b19-97dd-d99d7b34e11f");
        changePasswordRequest.setOldPassword("123  ");
        changePasswordRequest.setNewPassword("123  ");

        boolean result = accountController.changPassword(changePasswordRequest);

        assertTrue(result);
    }

    @Test
    public void testChangePassword_WhenAccountIdNotFound() throws Exception {
        ChangePasswordRequest changePasswordRequest = new ChangePasswordRequest();
        changePasswordRequest.setAccountId("uhabrkuhbdilavhbkahber");
        changePasswordRequest.setOldPassword("123");
        changePasswordRequest.setNewPassword("1234");

        NotFound exception = assertThrows(NotFound.class, () -> {
            accountController.changPassword(changePasswordRequest);
        });

        assertEquals("user_not_found", exception.getMessage());
    }

    @Test
    public void testChangePassword_WhenChangePsswordRequestNUll() throws Exception {
        ChangePasswordRequest changePasswordRequest = new ChangePasswordRequest();
        changePasswordRequest.setAccountId(null);
        changePasswordRequest.setOldPassword("123");
        changePasswordRequest.setNewPassword("1234");

        BadRequest exception = assertThrows(BadRequest.class, () -> {
            accountController.changPassword(changePasswordRequest);
        });

        assertEquals("request_fail", exception.getMessage());
    }

    @Test
    void testDeleteAccount_Success() throws Exception {
        DeleteAccount deleteAccountRequest = new DeleteAccount();
        deleteAccountRequest.setUsername("duong2");
        deleteAccountRequest.setHrId("98cd178c-7ca2-4d75-8463-2187aa8f1462");

        boolean result = accountController.deleteAccount(deleteAccountRequest);

        assertTrue(result);
    }

    @Test
    void testDeleteAccount_NotFoundUserName() throws Exception {
        DeleteAccount deleteAccountRequest = new DeleteAccount();
        deleteAccountRequest.setUsername("duong22345");
        deleteAccountRequest.setHrId("98cd178c-7ca2-4d75-8463-2187aa8f1462");

        NotFound exception = assertThrows(NotFound.class, () -> {
            accountController.deleteAccount(deleteAccountRequest);
        });
        assertEquals("username_not_found", exception.getMessage());
    }

    @Test
    void testDeleteAccount_BadRequestUsenameNULL() throws Exception {
        DeleteAccount deleteAccountRequest = new DeleteAccount();
        deleteAccountRequest.setUsername(null);
        deleteAccountRequest.setHrId("98cd178c-7ca2-4d75-8463-2187aa8f1462");

        BadRequest exception = assertThrows(BadRequest.class, () -> {
            accountController.deleteAccount(deleteAccountRequest);
        });
        assertEquals("username_is_null", exception.getMessage());
    }

    @Test
    void testDeleteAccount_ServerError() throws Exception {
        DeleteAccount deleteAccountRequest = new DeleteAccount();
        deleteAccountRequest.setUsername("tungsec");
        deleteAccountRequest.setHrId(null);

        ServerError exception = assertThrows(ServerError.class, () -> {
            accountController.deleteAccount(deleteAccountRequest);
        });
        assertEquals("can_not_delete", exception.getMessage());
    }
//
//    @Test
//    public void testchangeRoleAccount_Success() throws Exception {
//        ChangeRoleRequest changeRoleRequest = new ChangeRoleRequest();
//        changeRoleRequest.setAccountId("227286b1-bfc0-4b26-a1de-978d3723e162");
//        changeRoleRequest.setRoleName("employee");
//        changeRoleRequest.setDepartmentId("3");
//
//        boolean result = accountController.changeRoleAccount(changeRoleRequest);
//
//        assertTrue(result);
//    }

    @Test
    public void testchangeRoleAccount_BadRequestRoleNotFound() throws Exception {
        ChangeRoleRequest changeRoleRequest = new ChangeRoleRequest();
        changeRoleRequest.setAccountId("227286b1-bfc0-4b26-a1de-978d3723e162");
        changeRoleRequest.setRoleName("leader");
        changeRoleRequest.setDepartmentId("3");

        BadRequest exception = assertThrows(BadRequest.class, () -> {
            accountController.changeRoleAccount(changeRoleRequest);
        });
        assertEquals("Not_found_role", exception.getMessage());
    }
    //note

    @Test
    public void testchangeRoleAccount_BadRequestDepartmentNotFound() throws Exception {
        ChangeRoleRequest changeRoleRequest = new ChangeRoleRequest();
        changeRoleRequest.setAccountId("227286b1-bfc0-4b26-a1de-978d3723e162");
        changeRoleRequest.setRoleName("employee");
        changeRoleRequest.setDepartmentId("6");

        BadRequest exception = assertThrows(BadRequest.class, () -> {
            accountController.changeRoleAccount(changeRoleRequest);
        });
        assertEquals("Not_found_department", exception.getMessage());
    }

    @Test
    public void testchangeRoleAccount_ServerErrorReuestNULL() throws Exception {
        ChangeRoleRequest changeRoleRequest = new ChangeRoleRequest();
        changeRoleRequest.setAccountId(null);
        changeRoleRequest.setRoleName(null);
        changeRoleRequest.setDepartmentId("5");

        ServerError exception = assertThrows(ServerError.class, () -> {
            accountController.changeRoleAccount(changeRoleRequest);
        });
        assertEquals("fail", exception.getMessage());
    }

    @Test
    public void testchangeStatusAccount_Success() throws Exception {
        ChangeStatusAccountRequest changeStatusAccountRequest = new ChangeStatusAccountRequest();
        changeStatusAccountRequest.setAccountId("ab0d5969-d2af-49be-9aba-0e288fbf1e09");
        changeStatusAccountRequest.setStatusName("inactive");

        boolean result = accountController.changeStatusAccount(changeStatusAccountRequest);

        assertTrue(result);
    }

    @Test
    public void testchangeStatusAccount_WhenUserNotFound() throws Exception {
        ChangeStatusAccountRequest changeStatusAccountRequest = new ChangeStatusAccountRequest();
        changeStatusAccountRequest.setAccountId("sdfsgsdgdfg");
        changeStatusAccountRequest.setStatusName("inactive");

        NotFound exception = assertThrows(NotFound.class, () -> {
            accountController.changeStatusAccount(changeStatusAccountRequest);
        });
        assertEquals("user_not_found", exception.getMessage());
    }

    @Test
    public void testchangeStatusAccount_WhenStatusNotFound() throws Exception {
        ChangeStatusAccountRequest changeStatusAccountRequest = new ChangeStatusAccountRequest();
        changeStatusAccountRequest.setAccountId("ab0d5969-d2af-49be-9aba-0e288fbf1e09");
        changeStatusAccountRequest.setStatusName("inactiveeeeeeee");

        NotFound exception = assertThrows(NotFound.class, () -> {
            accountController.changeStatusAccount(changeStatusAccountRequest);
        });
        assertEquals("status_not_found", exception.getMessage());
    }

    @Test
    public void testchangeStatusAccount_WhenStatusExist() throws Exception {
        ChangeStatusAccountRequest changeStatusAccountRequest = new ChangeStatusAccountRequest();
        changeStatusAccountRequest.setAccountId("ab0d5969-d2af-49be-9aba-0e288fbf1e09");
        changeStatusAccountRequest.setStatusName("inactive");

        BadRequest exception = assertThrows(BadRequest.class, () -> {
            accountController.changeStatusAccount(changeStatusAccountRequest);
        });
        assertEquals("new_status_existed", exception.getMessage());
    }

    @Test
    public void testchangeStatusAccount_WhenBaDrequest() throws Exception {
        ChangeStatusAccountRequest changeStatusAccountRequest = new ChangeStatusAccountRequest();
        changeStatusAccountRequest.setAccountId(null);
        changeStatusAccountRequest.setStatusName("inactive");

        BadRequest exception = assertThrows(BadRequest.class, () -> {
            accountController.changeStatusAccount(changeStatusAccountRequest);
        });
        assertEquals("request_fail", exception.getMessage());
    }

    @Test
    public void testgetRoleByUserId_Success() throws Exception {
        GetUserInfoRequest getUserInfoRequest = new GetUserInfoRequest();
        getUserInfoRequest.setUserId("ab0d5969-d2af-49be-9aba-0e288fbf1e09");

        RoleDto userInfor = accountController.getRoleByUserId(getUserInfoRequest);

        assertEquals("hr", userInfor.getRoleName());
    }

    @Test
    public void testgetRoleByUserId_UserIdNotFound() throws Exception {
        GetUserInfoRequest getUserInfoRequest = new GetUserInfoRequest();
        getUserInfoRequest.setUserId("asdasdasd");

        NotFound exception = assertThrows(NotFound.class, () -> {
            accountController.getRoleByUserId(getUserInfoRequest);
        });
        assertEquals("user_not_found", exception.getMessage());
    }

    @Test
    public void testgetRoleByUserId_UserIdNULL() throws Exception {
        GetUserInfoRequest getUserInfoRequest = new GetUserInfoRequest();
        getUserInfoRequest.setUserId(null);

        BadRequest exception = assertThrows(BadRequest.class, () -> {
            accountController.getRoleByUserId(getUserInfoRequest);
        });
        assertEquals("request_fail", exception.getMessage());
    }

    @Test
    public void testgetAllAccount_Success() throws Exception {
        ResponseEntity<?> response = accountController.getAllAccount();
        List<Account> accounts = (List<Account>) response.getBody();

        assertEquals(10, accounts.size());
        assertTrue(response.getStatusCode().is2xxSuccessful());
    }
    //

//    @Test
//    public void testsaveUser_Success() throws Exception {
//        RegisterRequest registerRequest = new RegisterRequest();
//        registerRequest.setUsername("manager_secu");
//        registerRequest.setPassword("123");
//        registerRequest.setRole("manager");
//        registerRequest.setDepartmentName("security");
//        registerRequest.setHrId("0dff5d5c-095d-4386-91f2-82bdb7eba342");
//
//        boolean result = accountManageService.saveNewAccount(registerRequest);
//
//        assertTrue(result);
//        assertTrue(accountRepository.existsByUsername("secu1"));
//
//    }

}
