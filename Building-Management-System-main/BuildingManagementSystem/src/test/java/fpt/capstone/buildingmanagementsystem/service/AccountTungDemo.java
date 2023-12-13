package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.mapper.AccountMapper;
import fpt.capstone.buildingmanagementsystem.mapper.RoleMapper;
import fpt.capstone.buildingmanagementsystem.model.dto.RoleDto;
import fpt.capstone.buildingmanagementsystem.model.entity.Account;
import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import fpt.capstone.buildingmanagementsystem.model.entity.Role;
import fpt.capstone.buildingmanagementsystem.model.entity.Status;
import fpt.capstone.buildingmanagementsystem.model.request.*;
import fpt.capstone.buildingmanagementsystem.model.response.GetAllAccountResponse;
import fpt.capstone.buildingmanagementsystem.repository.*;
import fpt.capstone.buildingmanagementsystem.security.PasswordEncode;
import fpt.capstone.buildingmanagementsystem.until.EmailSender;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
class AccountTungDemo {
    @Autowired
    AccountManageService accountManageService;

    @Mock
    DepartmentRepository departmentRepository;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private StatusRepository statusRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncode passwordEncode;

    @Mock
    private AccountMapper accountMapper;

    @Mock
    private RoleMapper roleMapper;

    @Mock
    private EmailSender emailSender;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void testLoadUserByUsername() {
        String username = "tungnon";
        UserDetails userDetails = accountManageService.loadUserByUsername(username);
        assertEquals(username, userDetails.getUsername());
        assertEquals("$2a$10$R0Zzy6fYAkcFKeV1lK53DOFXQ9nhxNeMwV6pxrPtDSORdnOBqP1bC", userDetails.getPassword());
        assertEquals("security", userDetails.getAuthorities().iterator().next().getAuthority());
    }

    @Test
    void testLoadUserByUsernameUserNotFound() {
        String username = "nonexistentUser";
        NotFound exception = org.junit.jupiter.api.Assertions.assertThrows(NotFound.class,
                () -> accountManageService.loadUserByUsername(username));

        assertEquals("user_not_found", exception.getMessage());
    }

    @Test
    void testLoadUserByUsername_RoleNotFound() {
        // Arrange
        String username = "tungnon";
        Account account = new Account();
        account.setUsername(username);
        account.setPassword("$2a$10$R0Zzy6fYAkcFKeV1lK53DOFXQ9nhxNeMwV6pxrPtDSORdnOBqP1bC");
        Role role = new Role();
        role.setRoleId("");
        role.setRoleName("");

        account.setRole(role);

        when(accountRepository.findByUsername(username)).thenReturn(Optional.of(account));
        when(roleRepository.findByRoleId(String.valueOf(role)));

        // Act and Assert
        assertThrows(NotFound.class, () -> accountManageService.loadUserByUsername(username));
    }

//    @Test
//    void testSaveNewAccount_Success() {
//        // Create new each tc
//        RegisterRequest registerRequest = new RegisterRequest();
//        registerRequest.setUsername("cc");
//        registerRequest.setPassword("123");
//        registerRequest.setRole("employee");
//        registerRequest.setDepartmentName("business");
//
//        when(accountRepository.existsByUsername("cc")).thenReturn(false);
//
//        Role role = new Role();
//        role.setRoleName("employee");
//        when(roleRepository.findByRoleName("employee")).thenReturn(Optional.of(role));
//
//        Department department = new Department();
//        department.setDepartmentName("business");
//        when(departmentRepository.findByDepartmentName("business")).thenReturn(Optional.of(department));
//
//        Status status = new Status();
//        status.setStatusId("1");
//        when(statusRepository.findByStatusId("1")).thenReturn(Optional.of(status));
//
//        when(accountMapper.convertRegisterAccount(registerRequest, status, role)).thenReturn(new Account());
//
//        // Act
//        boolean result = accountManageService.saveNewAccount(registerRequest);
//
//        // Assert
//        assertTrue(result);
//    }

    @Test
    void testChangePassword() {
        ChangePasswordRequest changePasswordRequest = new ChangePasswordRequest();
        changePasswordRequest.setAccountId("e0b48efb-8b08-4f45-a686-3fe41187bf63");
        changePasswordRequest.setOldPassword("123");
        changePasswordRequest.setNewPassword("1234");

        boolean result = accountManageService.changePassword(changePasswordRequest);

        assertTrue(result);
    }

    @Test
    void testCheckUsernameAndPassword() {
        // account blocked
//        String username = "tungnotactive";
//        String password = "123456789";

        //wrong password
//        String username = "tungnon";
//        String password = "12341231256789";

        //success
        String username = "tanktop";
        String password = "1234";
        Account account = new Account();
        account.setUsername(username);
        Status status = new Status();
        status.setStatusId("0");
        account.setStatus(status);
        // Act
        boolean result = accountManageService.checkUsernameAndPassword(username, password);

        // Assert
        assertTrue(result);
    }


    @Test
    void testChangeStatusAccount() {

        String accountId = "e0b48efb-8b08-4f45-a686-3fe41187bf63";
        String newStatusName = "active";
        String oldStatusName = "inactive";

        Account account = new Account();
        account.setAccountId(accountId);
        Status oldStatus = new Status();
        oldStatus.setStatusName(oldStatusName);
        Status newStatus = new Status();
        oldStatus.setStatusName(newStatusName);


        // Act
        boolean result = accountManageService.changeStatusAccount(new ChangeStatusAccountRequest(accountId, newStatusName));

        // Assert
        assertTrue(result);
        assertEquals(newStatusName, account.getStatus().getStatusName());
    }

//    @Test
//    void testChangeRoleAccount() {
//        ChangeRoleRequest changeRoleRequest = new ChangeRoleRequest();
//        changeRoleRequest.setAccountId("e0b48efb-8b08-4f45-a686-3fe41187bf63");
//        changeRoleRequest.setRoleName("manager");
//
//        boolean result = accountManageService.changeRoleAccount(changeRoleRequest);
//
//        assertTrue(result);
//
//    }

    //can tim hieu ve mailsender
    @Test
    void testResetPassword() {
        // Arrange
        String username = "nmh";
        String newPassword = "1234567890";
        ResetPasswordRequest resetPasswordRequest = new ResetPasswordRequest(username);

        when(accountRepository.existsByUsername(username)).thenReturn(true);
        when(accountRepository.updatePassword(any(), any(), any())).thenReturn(1); // Simulate update success
        when(passwordEncode.passwordEncoder().encode(newPassword)).thenReturn("encodedPassword");

        // Act
        boolean result = accountManageService.resetPassword(resetPasswordRequest);

        // Assert
        assertTrue(result);
        verify(emailSender, times(1)).setMailSender(any(), anyString(), anyString());
    }

    @Test
    void getGettingRole() {
        String username= "tungnon";

        RoleDto result = accountManageService.getGettingRole(username);

        assertNotNull(result);
        assertEquals("security", result.getRoleName());
    }

    @Test
    void testGetGetAllAccount() {
        // Arrange
        List<Account> accounts = new ArrayList<>();

        when(accountRepository.findAll()).thenReturn(accounts);

        // Act
        List<GetAllAccountResponse> responses = accountManageService.getGetAllAccount();

        // Assert
        assertNotNull(responses);
        assertFalse(responses.isEmpty());
        assertEquals(9, responses.size());
    }

    @Test
    void testGetAccountId() {
        String username = "tanktop";
        String result = accountManageService.getAccountId(username);

        assertEquals("e0b48efb-8b08-4f45-a686-3fe41187bf63", result);
    }
}