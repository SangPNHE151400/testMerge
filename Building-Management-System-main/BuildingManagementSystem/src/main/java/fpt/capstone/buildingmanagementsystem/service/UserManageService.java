package fpt.capstone.buildingmanagementsystem.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.exception.ServerError;
import fpt.capstone.buildingmanagementsystem.mapper.UserMapper;
import fpt.capstone.buildingmanagementsystem.mapper.UserPendingMapper;
import fpt.capstone.buildingmanagementsystem.model.entity.Account;
import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import fpt.capstone.buildingmanagementsystem.model.entity.UserPending;
import fpt.capstone.buildingmanagementsystem.model.entity.UserPendingStatus;
import fpt.capstone.buildingmanagementsystem.model.request.AcceptOrRejectChangeUserInfo;
import fpt.capstone.buildingmanagementsystem.model.request.ChangeUserInfoRequest;
import fpt.capstone.buildingmanagementsystem.model.request.GetUserInfoRequest;
import fpt.capstone.buildingmanagementsystem.model.response.ChangeInfoAcceptDetailsResponse;
import fpt.capstone.buildingmanagementsystem.model.response.EmployeeResponse;
import fpt.capstone.buildingmanagementsystem.model.response.GetAllUserInfoPending;
import fpt.capstone.buildingmanagementsystem.model.response.GetUserInfoResponse;
import fpt.capstone.buildingmanagementsystem.model.response.HrDepartmentResponse;
import fpt.capstone.buildingmanagementsystem.model.response.ManagerInfoResponse;
import fpt.capstone.buildingmanagementsystem.model.response.ReceiveIdAndDepartmentIdResponse;
import fpt.capstone.buildingmanagementsystem.model.response.UserAccountResponse;
import fpt.capstone.buildingmanagementsystem.model.response.UserInfoResponse;
import fpt.capstone.buildingmanagementsystem.repository.AccountRepository;
import fpt.capstone.buildingmanagementsystem.repository.DepartmentRepository;
import fpt.capstone.buildingmanagementsystem.repository.RoleRepository;
import fpt.capstone.buildingmanagementsystem.repository.UserPendingRepository;
import fpt.capstone.buildingmanagementsystem.repository.UserPendingStatusRepository;
import fpt.capstone.buildingmanagementsystem.repository.UserRepository;
import fpt.capstone.buildingmanagementsystem.repository.UserRepositoryV2;
import fpt.capstone.buildingmanagementsystem.service.schedule.TicketRequestScheduledService;
import fpt.capstone.buildingmanagementsystem.until.Until;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static fpt.capstone.buildingmanagementsystem.until.Until.generateRealTime;

@Service
public class UserManageService {
    @Autowired
    AutomaticNotificationService automaticNotificationService;
    @Autowired
    AccountRepository accountRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    DepartmentRepository departmentRepository;
    @Autowired
    UserPendingRepository userPendingRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    UserMapper userMapper;
    @Autowired
    UserPendingMapper userPendingMapper;
    @Autowired
    UserPendingStatusRepository userPendingStatusRepository;

    @Autowired
    UserRepositoryV2 userRepositoryV2;

    private static final Logger logger = LoggerFactory.getLogger(TicketRequestScheduledService.class);


    public boolean ChangeUserInfo(String data, MultipartFile file) {
        try {
            ChangeUserInfoRequest changeUserInfoRequest = new ObjectMapper().readValue(data, ChangeUserInfoRequest.class);
            String userId = changeUserInfoRequest.getUserId();
            if (userId != null && changeUserInfoRequest.getFirstName() != null &&
                    changeUserInfoRequest.getLastName() != null &&
                    changeUserInfoRequest.getCountry() != null &&
                    changeUserInfoRequest.getEmail() != null &&
                    changeUserInfoRequest.getGender() != null &&
                    changeUserInfoRequest.getCity() != null &&
                    changeUserInfoRequest.getTelephoneNumber() != null &&
                    changeUserInfoRequest.getDateOfBirth() != null &&
                    changeUserInfoRequest.getAddress() != null
            ) {
                User user = userRepository.findByUserId(changeUserInfoRequest.getUserId()).get();
                String name = "avatar_" + UUID.randomUUID();
                if (file != null) {
                    String[] subFileName = Objects.requireNonNull(file.getOriginalFilename()).split("\\.");
                    List<String> stringList = new ArrayList<>(Arrays.asList(subFileName));
                    name = name + "." + stringList.get(stringList.size() - 1);
                    Bucket bucket = StorageClient.getInstance().bucket();
                    bucket.create(name, file.getBytes(), file.getContentType());
                } else {
                    name = user.getImage();
                }
                Optional<UserPendingStatus> userPendingStatus = userPendingStatusRepository.findByUserPendingStatusId("1");
                UserPending userPending = userPendingMapper.convertRegisterAccount(changeUserInfoRequest);
                userPending.setImage(name);
                userPending.setUsername(user.getAccount().getUsername());
                userPending.setUserPendingStatus(userPendingStatus.get());
                userPending.setApprovedDate(user.getApprovedDate());
                userPending.setDepartmentName(user.getDepartment().getDepartmentName());
                userPending.setAcceptedBy(user.getAcceptedBy());
                userPending.setRoleName(user.getAccount().getRole().getRoleName());
                userPendingRepository.save(userPending);
                return true;
            } else {
                throw new BadRequest("request_fail");
            }
        } catch (Exception e) {
            throw new ServerError("fail");
        }
    }


    public boolean AcceptChangeUserInfo(AcceptOrRejectChangeUserInfo acceptOrRejectChangeUserInfo) {
        try {
            String userId = acceptOrRejectChangeUserInfo.getUserId();
            String hrId = acceptOrRejectChangeUserInfo.getHrId();
            if (userId != null) {
                if (!userRepository.existsById(userId)) {
                    throw new NotFound("user_not_found");
                }
                Optional<User> user = userRepository.findByUserId(userId);
                Optional<User> hr = userRepository.findByUserId(hrId);
                Optional<UserPending> userPending = userPendingRepository.findById(userId);
                if (!userPending.isPresent() || !user.isPresent()) {
                    throw new NotFound("not_found");
                }
                String oldImage = user.get().getImage();
                String newImage = userPending.get().getImage();
                if (!Objects.equals(newImage, oldImage)) {
                    Bucket bucket = StorageClient.getInstance().bucket();
                    Blob blob = bucket.get(oldImage);
                    if (blob != null) {
                        blob.delete();
                    }
                }
                userRepository.updateAcceptUserInfo(userPending.get().getFirstName(), userPending.get().getLastName(), userPending.get().getGender()
                        , userPending.get().getDateOfBirth(), userPending.get().getTelephoneNumber()
                        , userPending.get().getCountry(), userPending.get().getCity(), userPending.get().getAddress(), hr.get().getAccount().getUsername()
                        , Until.generateRealTime(), userPending.get().getEmail()
                        , userPending.get().getImage(), generateRealTime()
                        , userId);
                userPendingRepository.updateStatus("2", userId);
                automaticNotificationService.sendChangeNotification(acceptOrRejectChangeUserInfo, "accepted");
                return true;
            } else {
                throw new BadRequest("request_fail");
            }
        } catch (ServerError e) {
            throw new ServerError("fail");
        }
    }

    public boolean RejectChangeUserInfo(AcceptOrRejectChangeUserInfo acceptOrRejectChangeUserInfo) {
        try {
            if (acceptOrRejectChangeUserInfo.getUserId() != null) {
                if (userPendingRepository.existsById(acceptOrRejectChangeUserInfo.getUserId())) {
                    userPendingRepository.updateStatus("3", acceptOrRejectChangeUserInfo.getUserId());
                    automaticNotificationService.sendChangeNotification(acceptOrRejectChangeUserInfo, "rejected");
                    return true;
                } else {
                    throw new NotFound("user_not_found");
                }
            } else {
                throw new BadRequest("request_fail");
            }
        } catch (ServerError e) {
            throw new ServerError("fail");
        }
    }

    public List<GetAllUserInfoPending> getAllUserNotVerify() {
        UserPendingStatus status = new UserPendingStatus("1", "not_verify");
        List<GetAllUserInfoPending> listResponse = new ArrayList<>();
        List<UserPending> userPending = userPendingRepository.findAllByUserPendingStatus(status);
        if (userPending.size() == 0) {
            return listResponse;
        }
        userPending.forEach(element -> listResponse.add(userPendingMapper.convertGetUserInfoPending(element)));
        return listResponse;
    }

    public GetUserInfoResponse getInfoUser(GetUserInfoRequest getUserInfoRequest) {
        GetUserInfoResponse getUserInfoResponse;
        if (getUserInfoRequest.getUserId() != null) {
            Optional<User> user = userRepository.findByUserId(getUserInfoRequest.getUserId());
            if (!user.isPresent()) {
                throw new NotFound("user_not_found");
            }
            getUserInfoResponse = userMapper.convertGetUserInfo(user.get());
            getUserInfoResponse.setUserName(user.get().getAccount().getUsername());
            getUserInfoResponse.setHireDate(user.get().getAccount().getCreatedDate());
            getUserInfoResponse.setAddress(user.get().getAddress());
            getUserInfoResponse.setRoleName(user.get().getAccount().getRole().getRoleName());
            getUserInfoResponse.setDepartmentId(user.get().getDepartment().getDepartmentId());
            getUserInfoResponse.setDepartmentName(user.get().getDepartment().getDepartmentName());
        } else {
            throw new BadRequest("request_fail");
        }
        return getUserInfoResponse;
    }

    public List<UserInfoResponse> getAllUserInfo() {
        List<UserInfoResponse> userInfoResponses = new ArrayList<>();
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) return userInfoResponses;
        return getUserInfoResponses(userInfoResponses, users);
    }
    public List<UserInfoResponse> getAllUserInfoActive() {
        List<UserInfoResponse> userInfoResponses = new ArrayList<>();
        List<User> users = userRepository.findAllByAccount_Status_StatusName("active");
        if (users.isEmpty()) return userInfoResponses;
        return getUserInfoResponses(userInfoResponses, users);
    }

    public ChangeInfoAcceptDetailsResponse getChangeInfoDetail(GetUserInfoRequest getUserInfoRequest) {
        Optional<User> userOptional = userRepository.findByUserId(getUserInfoRequest.getUserId());
        Optional<UserPending> userPendingOptional = userPendingRepository.findById(getUserInfoRequest.getUserId());
        if (userOptional.isPresent() && userPendingOptional.isPresent()) {
            User user = userOptional.get();
            UserPending userPending = userPendingOptional.get();
            return ChangeInfoAcceptDetailsResponse
                    .builder()
                    .username(user.getAccount().getUsername()).role(user.getAccount().getRole().getRoleName())
                    .department(user.getDepartment().getDepartmentName()).hireDate(user.getCreatedDate().toString()).genderBefore(user.getGender()).genderAfter(userPending.getGender())
                    .firstNameBefore(user.getFirstName()).imageBefore(user.getImage()).lastNameBefore(user.getLastName()).emailBefore(user.getEmail())
                    .dateOfBirthBefore(user.getDateOfBirth()).phoneBefore(user.getTelephoneNumber()).addressBefore(user.getAddress()).cityBefore(user.getCity())
                    .countryBefore(user.getCountry()).firstNameAfter(userPending.getFirstName()).imageAfter(userPending.getImage()).lastNameAfter(userPending.getLastName())
                    .emailAfter(userPending.getEmail()).dateOfBirthAfter(userPending.getDateOfBirth()).phoneAfter(userPending.getTelephoneNumber()).addressAfter(userPending.getAddress())
                    .cityAfter(userPending.getCity()).countryAfter(userPending.getCountry())
                    .build();
        } else {
            throw new BadRequest("request_fail");
        }
    }

    public ReceiveIdAndDepartmentIdResponse getReceiveIdAndDepartmentId(String userId) {
        if (userId != null) {
            if (userRepository.findByUserId(userId).isPresent()) {
                Department department = userRepository.findByUserId(userId).get().getDepartment();
                List<User> userOfDepartment = userRepository.findAllByDepartment(department);
                String managerId = null;
                for (int i = 0; i < userOfDepartment.size(); i++) {
                    Optional<Account> account = accountRepository.findByAccountId(userOfDepartment.get(i).getUserId());
                    if (Objects.equals(account.get().getRole().getRoleId(), "3")) {
                        managerId = account.get().getAccountId();
                    }
                }
                ManagerInfoResponse managerInfoResponse = ManagerInfoResponse.builder().managerDepartmentId(department.getDepartmentId())
                        .managerDepartmentName(department.getDepartmentName())
                        .managerId(managerId)
                        .build();
                Optional<Department> departmentHr = departmentRepository.findByDepartmentId("3");
                HrDepartmentResponse hrDepartmentResponse = HrDepartmentResponse.builder().hrDepartmentId(departmentHr.get().getDepartmentId())
                        .hrDepartmentName(departmentHr.get().getDepartmentName())
                        .build();
                return new ReceiveIdAndDepartmentIdResponse(managerInfoResponse, hrDepartmentResponse);
            } else {
                throw new NotFound("user_not_found");
            }
        } else {
            throw new BadRequest("request_fail");
        }
    }

    public List<EmployeeResponse> getAllDepartmentEmployee(String departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new BadRequest("Not_found_department"));
        List<User> users = userRepository.findAllByDepartment(department);

        return users.stream()
                .filter(user -> user.getAccount().getRole().roleName.equals("employee"))
                .map(user -> new EmployeeResponse(
                        user.getUserId(),
                        user.getAccount().getUsername(),
                        user.getFirstName(),
                        user.getLastName()
                )).collect(Collectors.toList());
    }

    public List<UserInfoResponse> getManagerByDepartmentId(String departmentId) {
        List<UserInfoResponse> userInfoResponses = new ArrayList<>();
        List<User> users = userRepository.getManagerByDepartmentId(departmentId);
        logger.info("" + users.size());
        return getUserInfoResponses(userInfoResponses, users);
    }

    private List<UserInfoResponse> getUserInfoResponses(List<UserInfoResponse> userInfoResponses, List<User> users) {
        users.forEach(u -> {
            UserInfoResponse response = new UserInfoResponse();
            BeanUtils.copyProperties(u, response);
            response.setAccountId(u.getUserId());
            response.setRoleName(u.getAccount().getRole().getRoleName());
            response.setUsername(u.getAccount().getUsername());
            userInfoResponses.add(response);
        });
        return userInfoResponses;
    }

    public List<UserAccountResponse> getUserAccount(String userId) {
        return userRepositoryV2.getUserAccount().stream()
                .filter(user -> !user.getAccountId().equals(userId))
                .collect(Collectors.toList());
    }
    public List<UserAccountResponse> getUserAccountActive(String userId) {
        return userRepositoryV2.getUserAccountActive().stream()
                .filter(user -> !user.getAccountId().equals(userId))
                .collect(Collectors.toList());
    }
}
