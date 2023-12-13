package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.Conflict;
import fpt.capstone.buildingmanagementsystem.exception.ForbiddenError;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.exception.ServerError;
import fpt.capstone.buildingmanagementsystem.mapper.AccountMapper;
import fpt.capstone.buildingmanagementsystem.mapper.RoleMapper;
import fpt.capstone.buildingmanagementsystem.model.dto.RoleDto;
import fpt.capstone.buildingmanagementsystem.model.entity.Account;
import fpt.capstone.buildingmanagementsystem.model.entity.ChatMessage;
import fpt.capstone.buildingmanagementsystem.model.entity.DailyLog;
import fpt.capstone.buildingmanagementsystem.model.entity.DayOff;
import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import fpt.capstone.buildingmanagementsystem.model.entity.InactiveManagerTemp;
import fpt.capstone.buildingmanagementsystem.model.entity.OvertimeLog;
import fpt.capstone.buildingmanagementsystem.model.entity.RequestMessage;
import fpt.capstone.buildingmanagementsystem.model.entity.RequestTicket;
import fpt.capstone.buildingmanagementsystem.model.entity.Role;
import fpt.capstone.buildingmanagementsystem.model.entity.Status;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.ControlLogStatus;
import fpt.capstone.buildingmanagementsystem.model.request.AccountDeviceRequest;
import fpt.capstone.buildingmanagementsystem.model.request.ChangePasswordRequest;
import fpt.capstone.buildingmanagementsystem.model.request.ChangeRoleRequest;
import fpt.capstone.buildingmanagementsystem.model.request.ChangeStatusAccountRequest;
import fpt.capstone.buildingmanagementsystem.model.request.ChangeStatusRequest;
import fpt.capstone.buildingmanagementsystem.model.request.GetUserInfoRequest;
import fpt.capstone.buildingmanagementsystem.model.request.RegisterRequest;
import fpt.capstone.buildingmanagementsystem.model.request.ResetPasswordRequest;
import fpt.capstone.buildingmanagementsystem.model.response.AccountResponse;
import fpt.capstone.buildingmanagementsystem.model.response.GetAllAccountResponse;
import fpt.capstone.buildingmanagementsystem.repository.AccountRepository;
import fpt.capstone.buildingmanagementsystem.repository.ChatMessageRepository;
import fpt.capstone.buildingmanagementsystem.repository.DailyLogRepository;
import fpt.capstone.buildingmanagementsystem.repository.DayOffRepository;
import fpt.capstone.buildingmanagementsystem.repository.DepartmentRepository;
import fpt.capstone.buildingmanagementsystem.repository.InactiveManagerTempRepository;
import fpt.capstone.buildingmanagementsystem.repository.OverTimeRepository;
import fpt.capstone.buildingmanagementsystem.repository.RequestMessageRepository;
import fpt.capstone.buildingmanagementsystem.repository.RequestTicketRepository;
import fpt.capstone.buildingmanagementsystem.repository.RoleRepository;
import fpt.capstone.buildingmanagementsystem.repository.StatusRepository;
import fpt.capstone.buildingmanagementsystem.repository.UserRepository;
import fpt.capstone.buildingmanagementsystem.security.PasswordEncode;
import fpt.capstone.buildingmanagementsystem.until.EmailSender;
import fpt.capstone.buildingmanagementsystem.until.Until;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static fpt.capstone.buildingmanagementsystem.until.Until.generateRealTime;
import static fpt.capstone.buildingmanagementsystem.until.Until.getRandomString;

@Service
public class AccountManageService implements UserDetailsService {

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    @Autowired
    DailyLogRepository dailyLogRepository;
    @Autowired
    OverTimeRepository overTimeRepository;
    @Autowired
    ChatMessageRepository chatMessageRepository;
    @Autowired
    RequestTicketRepository requestTicketRepository;
    @Autowired
    RequestMessageRepository requestMessageRepository;
    @Autowired
    DepartmentRepository departmentRepository;
    @Autowired
    EmailSender emailSender;
    @Autowired
    AccountRepository accountRepository;

    @Autowired
    DayOffRepository dayOffRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    PasswordEncode passwordEncode;
    @Autowired
    AccountMapper accountMapper;
    @Autowired
    StatusRepository statusRepository;
    @Autowired
    UserRepository userRepository;

    @Autowired
    InactiveManagerTempRepository tempRepository;
    @Autowired
    RoleMapper roleMapper;

    @Autowired
    TicketManageService ticketManageService;

    @Autowired
    DailyLogService dailyLogService;

    @Autowired
    DeviceService deviceService;

    @Autowired
    NotificationService notificationService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Account> userAccount = accountRepository.findByUsername(username);
        if (!userAccount.isPresent()) {
            throw new NotFound("user_not_found");
        }
        Optional<Role> role = roleRepository.findByRoleId(userAccount.get().getRole().getRoleId());
        if (!role.isPresent()) {
            throw new NotFound("role_not_found");
        }
        List<GrantedAuthority> grantList = new ArrayList<>();
        grantList.add(new SimpleGrantedAuthority(role.get().getRoleName()));
        return new org.springframework.security.core.userdetails.User(userAccount.get().getUsername(), userAccount.get().getPassword(),
                grantList);
    }

    @Transactional
    public ResponseEntity<?> saveNewAccount(RegisterRequest registerRequest) {
        try {
            if (registerRequest.getPassword() != null && registerRequest.getUsername() != null
                    && registerRequest.getRole() != null && registerRequest.getDepartmentName() != null
                    && registerRequest.getHrId() != null) {
                if (!accountRepository.existsByUsername(registerRequest.getUsername())) {
                    Optional<Role> role = roleRepository.findByRoleName(registerRequest.getRole());
                    Optional<Department> department = departmentRepository.findByDepartmentName(registerRequest.getDepartmentName());
                    if (role.isPresent() && department.isPresent()) {
                        Optional<Status> status = statusRepository.findByStatusId("1");
                        Account newAccount = accountMapper.convertRegisterAccount(registerRequest, status.get(), role.get());
                        Optional<Account> hr = accountRepository.findByAccountId(registerRequest.getHrId());
                        if (hr.isPresent() || registerRequest.getRole().equals("hr")) {
                            hr.ifPresent(account -> newAccount.setCreatedBy(account.getUsername()));
                            User user = User.builder().city("unknown").country("unknown").email("unknown").firstName("unknown")
                                    .lastName("unknown").dateOfBirth("unknown").telephoneNumber("unknown").gender("unknown").createdDate(
                                            generateRealTime()).address("unknown").image("unknown").updatedDate(generateRealTime()).account(newAccount).department(department.get())
                                    .build();
                            Account saveAccount;
                            if (Objects.equals(registerRequest.getRole(), "manager")) {
                                if (checkManagerOfDepartment(registerRequest.getDepartmentName())) {
                                    newAccount.setUser(user);
                                    saveAccount = accountRepository.saveAndFlush(newAccount);
                                } else {
                                    throw new Conflict("department_exist_manager");
                                }
                            } else {
                                newAccount.setUser(user);
                                saveAccount = accountRepository.saveAndFlush(newAccount);

                            }
                            dailyLogService.initDayOff(saveAccount.accountId);

                            // hidden notification
                            notificationService.hiddenNotificationSendAll(saveAccount.getUser());

                            // add to device_account
                            if (!registerRequest.roomId.isEmpty()) {
                                AccountDeviceRequest request = AccountDeviceRequest.builder()
                                        .accountId(saveAccount.accountId)
                                        .roomIdString(registerRequest.getRoomId())
                                        .startDate(dateFormat.format(saveAccount.createdDate))
                                        .build();
                                return deviceService.registerNewAccount(request);
                            }
                            return ResponseEntity.ok(true);
                        } else {
                            throw new NotFound("hr_id_not_found");
                        }
                    } else {
                        throw new NotFound("not_found");
                    }
                } else {
                    throw new BadRequest("username_exist");
                }
            } else {
                throw new BadRequest("request_fail");
            }
        } catch (ServerError e) {
            throw new ServerError("fail");
        }
    }

    public boolean changePassword(ChangePasswordRequest changePasswordRequest) {
        try {
            if (changePasswordRequest.getAccountId() != null && changePasswordRequest.getOldPassword() != null && changePasswordRequest.getNewPassword() != null) {
                Optional<Account> userAccount = accountRepository.findByAccountId(changePasswordRequest.getAccountId());
                if (!userAccount.isPresent()) {
                    throw new NotFound("user_not_found");
                }
                String username = accountRepository.findById(changePasswordRequest.getAccountId()).get().getUsername();
                if (checkUsernameAndPassword(username, changePasswordRequest.getOldPassword())) {
                    String newPassword = passwordEncode.passwordEncoder().encode(changePasswordRequest.getNewPassword());
                    accountRepository.updatePassword(newPassword, generateRealTime(), username);
                    return true;
                }
            } else {
                throw new BadRequest("request_fail");
            }
        } catch (ServerError e) {
            throw new ServerError("fail");
        }
        return false;
    }

    public boolean checkUsernameAndPassword(String username, String password) {
        try {
            if (accountRepository.existsByUsername(username)) {
                String passwordOld = accountRepository.findByUsername(username).get().getPassword();
                if (Objects.equals(accountRepository.findByUsername(username).get().getStatus().getStatusId(), "1")) {
                    if (passwordEncode.passwordEncoder().matches(password, passwordOld)) {
                        return true;
                    }
                } else {
                    throw new ForbiddenError("account_blocked");
                }
            } else {
                throw new NotFound("username_not_found");
            }
        } catch (ServerError e) {
            throw new ServerError("fail");
        }
        throw new BadRequest("password_wrong");
    }

    @Transactional
    public boolean changeStatusAccount(ChangeStatusAccountRequest changeStatusAccountRequest) {
        try {
            String accountId = changeStatusAccountRequest.getAccountId();
            if (accountId != null && changeStatusAccountRequest.getStatusName() != null) {
                if (!accountRepository.existsById(changeStatusAccountRequest.getAccountId())) {
                    throw new NotFound("user_not_found");
                }
                String oldStatus = accountRepository.findByAccountId(accountId).get().getStatus().getStatusName();
                if (!oldStatus.equals(changeStatusAccountRequest.getStatusName())) {
                    Optional<Status> status = statusRepository.findByStatusName(changeStatusAccountRequest.getStatusName());
                    Optional<User> user = userRepository.findByUserId(changeStatusAccountRequest.getAccountId());
                    if (status.isPresent() && user.isPresent()) {
                        if (Objects.equals(user.get().getAccount().getRole().getRoleName(), "manager")) {
                            throw new Conflict("manager_account_can_not_inactive");
                        } else {
                            if (Objects.equals(user.get().getAccount().getRole().getRoleName(), "hr")
                                    || Objects.equals(user.get().getAccount().getRole().getRoleName(), "admin")
                                    || Objects.equals(user.get().getAccount().getRole().getRoleName(), "security")) {
                                ticketManageService.resetTicketData(user.get());
                            }
                            accountRepository.updateStatusAccount(status.get().statusId, accountId);
                            ControlLogStatus controlLogStatus = changeStatusAccountRequest.statusName.equals("active") ? ControlLogStatus.WHITE_LIST : ControlLogStatus.BLACK_LIST;
                            return deviceService.changeAccountStatus(new ChangeStatusRequest(accountId, controlLogStatus));

                        }
                    } else {
                        throw new NotFound("status_not_found");
                    }
                } else {
                    throw new BadRequest("new_status_existed");
                }
            } else {
                throw new BadRequest("request_fail");
            }
        } catch (ServerError e) {
            throw new ServerError("fail");
        }
    }

    @Transactional
    public ResponseEntity<?> changeRoleAccount(ChangeRoleRequest changeRoleRequest) {
        try {
            String accountId = changeRoleRequest.getAccountId();
            if (accountId != null && changeRoleRequest.getRoleName() != null) {
                Account account = accountRepository.findByAccountId(accountId)
                        .orElseThrow(() -> new BadRequest("Not_found_user"));

                Role role = roleRepository.findByRoleName(changeRoleRequest.getRoleName())
                        .orElseThrow(() -> new BadRequest("Not_found_role"));

                Department department = departmentRepository.findByDepartmentId(changeRoleRequest.departmentId)
                        .orElseThrow(() -> new BadRequest("Not_found_department"));

                String newRoleId = role.getRoleId();

                if (Objects.equals(changeRoleRequest.getRoleName(), "manager")) {
                    if (checkManagerOfDepartment(department.getDepartmentName())) {
                        accountRepository.updateRoleAccount(newRoleId, accountId);
                        accountRepository.updateDepartmentUser(department.getDepartmentId(), accountId);
                        Optional<InactiveManagerTemp> inactiveManagerTempOptional = tempRepository.findByDepartment(department);
                        if (inactiveManagerTempOptional.isPresent()) {
                            InactiveManagerTemp inactiveManager = inactiveManagerTempOptional.get();
                            //update
                            ticketManageService.updateTicketOfNewManager(account, inactiveManager);
                            //delete from temp
                            tempRepository.delete(inactiveManager);
                        }
                        return ResponseEntity.ok(changeRoleRequest);
                    } else {
                        throw new Conflict("department_exist_manager");
                    }
                }
                if (Objects.equals(account.getRole().getRoleName(), "hr")
                        || Objects.equals(account.getRole().getRoleName(), "admin")
                        || Objects.equals(account.getRole().getRoleName(), "security")) {
                    ticketManageService.resetTicketData(account.getUser());
                }

                if (Objects.equals(account.getRole().getRoleName(), "manager") &&
                        !Objects.equals(changeRoleRequest.getRoleName(), "manager")) {
                    InactiveManagerTemp temp = InactiveManagerTemp.builder()
                            .manager(account)
                            .department(department)
                            .build();
                    tempRepository.save(temp);
                }
                account.getUser().setDepartment(department);
                userRepository.save(account.getUser());
                accountRepository.updateRoleAccount(newRoleId, accountId);

                if (!changeRoleRequest.getRoomId().isEmpty() && !changeRoleRequest.getDepartmentId().equals(account.getUser().getDepartment().getDepartmentId())) {
                    AccountDeviceRequest request = AccountDeviceRequest.builder()
                            .accountId(accountId)
                            .roomIdString(changeRoleRequest.getRoomId())
                            .startDate(dateFormat.format(Until.generateRealTime()))
                            .build();
                    return deviceService.registerNewAccount(request);
                }
                return ResponseEntity.ok(changeRoleRequest);
            } else {
                throw new ServerError("request_fail");
            }
        } catch (ServerError e) {
            throw new ServerError("fail");
        }
    }

    public boolean resetPassword(ResetPasswordRequest resetPassword) {
        try {
            String username = resetPassword.getUsername();
            if (username != null) {
                if (!accountRepository.existsByUsername(resetPassword.getUsername())) {
                    throw new NotFound("user_not_found");
                }
                String newPassword = getRandomString(8);
                String toEmail = accountRepository.findByUsername(username).get().getUser().getEmail();
                String newPasswordEncode = passwordEncode.passwordEncoder().encode(newPassword);
                accountRepository.updatePassword(newPasswordEncode, generateRealTime(), username);
                emailSender.setMailSender(toEmail, "[Notification] - Password has been successfully reset!", "Your newly reset password is: " + newPassword);
                return true;
            } else {
                throw new BadRequest("request_fail");
            }
        } catch (ServerError e) {
            throw new ServerError("fail");
        }
    }

    public RoleDto getGettingRole(String username) {
        Optional<Account> userAccount = accountRepository.findByUsername(username);
        Optional<Role> role = roleRepository.findByRoleId(userAccount.get().getRole().getRoleId());
        return roleMapper.convertRegisterAccount(role.get());
    }

    @Transactional
    public boolean deleteAccount(String username, String hrId) {
        if (username != null) {
            Optional<Account> userAccount = accountRepository.findByUsername(username);
            if (userAccount.isPresent()) {
                User user = userAccount.get().getUser();
                user.setAccount(null);
                List<RequestTicket> checkpoint1 = requestTicketRepository.findAllByUser(user);
                List<RequestMessage> checkpoint2 = requestMessageRepository.findAllBySender(user);
                List<RequestMessage> checkpoint3 = requestMessageRepository.findAllByReceiver(user);
                List<OvertimeLog> checkpoint4 = overTimeRepository.findAllByUser(user);
                List<ChatMessage> checkpoint5 = chatMessageRepository.findAllBySender(user);
//                List<ChatMessage> checkpoint6 = chatMessageRepository.findAllByReceiver(user);
                List<DailyLog> checkpoint7 = dailyLogRepository.findAllByUser(user);
                if (checkpoint1.size() == 0 &&
                        checkpoint2.size() == 0
                        && checkpoint3.size() == 0
                        && checkpoint4.size() == 0
                        && checkpoint5.size() == 0
//                        && checkpoint6.size() == 0
                        && checkpoint7.size() == 0
                        && accountRepository.findByUsername(userAccount.get().getCreatedBy()).isPresent()
                        && hrId.equals(accountRepository.findByUsername(userAccount.get().getCreatedBy()).get().getAccountId())) {
                    DayOff dayOff = dayOffRepository.findByAccount(userAccount.get())
                            .orElseThrow(() -> new BadRequest("Not_found_day_off"));
                    dayOffRepository.delete(dayOff);
                    notificationService.deleteFromHiddenNotification(userAccount.get().getUser());
                    deviceService.deleteAccountDevice(userAccount.get().getAccountId());
                    accountRepository.delete(userAccount.get());
                    return true;
                } else {
                    throw new ServerError("can_not_delete");
                }
            } else {
                throw new NotFound("username_not_found");
            }
        } else {
            throw new BadRequest("username_is_null");
        }
    }

    public RoleDto getGettingRole2(GetUserInfoRequest getUserInfoRequest) {
        if (getUserInfoRequest.getUserId() != null) {
            Optional<Account> userAccount = accountRepository.findByAccountId(getUserInfoRequest.getUserId());
            if (userAccount.isPresent()) {
                Optional<Role> role = roleRepository.findByRoleId(userAccount.get().getRole().getRoleId());
                return roleMapper.convertRegisterAccount(role.get());
            } else {
                throw new NotFound("user_not_found");
            }
        } else {
            throw new BadRequest("request_fail");
        }
    }

    public boolean checkManagerOfDepartment(String departmentName) {
        Optional<Department> department = departmentRepository.findByDepartmentName(departmentName);
        List<User> userOfDepartment = userRepository.findAllByDepartment(department.get());
        boolean checkPoint = true;
        for (int i = 0; i < userOfDepartment.size(); i++) {
            Optional<Account> account = accountRepository.findByAccountId(userOfDepartment.get(i).getUserId());
            if (Objects.equals(account.get().getRole().getRoleId(), "3")) {
                if (Objects.equals(account.get().getStatus().getStatusId(), "1")) {
                    checkPoint = false;
                } else {
                    Role role = roleRepository.findByRoleName("employee").get();
                    account.get().setRole(role);
                    accountRepository.save(account.get());
                }
            }
        }
        return checkPoint;
    }

    public List<GetAllAccountResponse> getGetAllAccount() {
        List<Account> account = accountRepository.findAll();
        List<GetAllAccountResponse> getAllAccountResponses = new ArrayList<>();
        if (account.size() == 0) {
            return getAllAccountResponses;
        }
        for (int i = 0; i < account.size(); i++) {
            if (account.get(i).getCreatedBy() == null) {
                account.remove(account.get(i));
            }
        }
        account = account.stream()
                .sorted((Comparator.comparing(Account::getCreatedDate).reversed()))
                .collect(Collectors.toList());
        account.forEach(element -> {
            GetAllAccountResponse get = accountMapper.convertGetAllAccount(element);
            get.setDepartmentName(element.getUser().getDepartment().getDepartmentName());
            get.setFirstName(element.getUser().getFirstName());
            get.setLastName(element.getUser().getLastName());
            get.setEmail(element.getUser().getEmail());
            get.setPhone(element.getUser().getTelephoneNumber());
            get.setGender(element.getUser().getGender());
            getAllAccountResponses.add(get);
        });
        return getAllAccountResponses;
    }

    public String getAccountId(String username) {
        Optional<Account> userAccount = accountRepository.findByUsername(username);
        return userAccount.get().getAccountId();
    }

    public AccountResponse getCreatedDate(String accountId) {
        Account account = accountRepository.findByAccountId(accountId)
                .orElseThrow(() -> new BadRequest("Not_found"));
        AccountResponse accountResponse = new AccountResponse();
        BeanUtils.copyProperties(account, accountResponse);
        return accountResponse;
    }
}
