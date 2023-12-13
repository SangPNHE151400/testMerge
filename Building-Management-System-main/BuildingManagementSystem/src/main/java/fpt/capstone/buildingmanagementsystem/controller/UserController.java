package fpt.capstone.buildingmanagementsystem.controller;


import fpt.capstone.buildingmanagementsystem.model.request.AcceptOrRejectChangeUserInfo;
import fpt.capstone.buildingmanagementsystem.model.request.GetUserInfoRequest;
import fpt.capstone.buildingmanagementsystem.model.response.ChangeInfoAcceptDetailsResponse;
import fpt.capstone.buildingmanagementsystem.model.response.EmployeeResponse;
import fpt.capstone.buildingmanagementsystem.model.response.UserAccountResponse;
import fpt.capstone.buildingmanagementsystem.model.response.UserInfoResponse;
import fpt.capstone.buildingmanagementsystem.service.UserManageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@CrossOrigin
public class UserController {
    @Autowired
    UserManageService userManageService;

    @RequestMapping(value = "/getAllUserInfoPending", method = RequestMethod.GET)
    public ResponseEntity<?> getAllUserInfoPending() throws Exception {
        return ResponseEntity.ok(userManageService.getAllUserNotVerify());
    }

    @RequestMapping(value = "/getInfoUser", method = RequestMethod.POST)
    public ResponseEntity<?> getInfoUser(@RequestBody GetUserInfoRequest getUserInfoRequest) throws Exception {
        return ResponseEntity.ok(userManageService.getInfoUser(getUserInfoRequest));
    }

    @RequestMapping(path = "/changeUserInfo", method = RequestMethod.POST, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public boolean changeUserInfo(@RequestParam("data") String data, @RequestParam(value = "image", required = false) MultipartFile image) throws Exception {
        return userManageService.ChangeUserInfo(data, image);
    }

    @RequestMapping(value = "/acceptChangeUserInfo", method = RequestMethod.POST)
    public boolean acceptChangeUserInfo(@RequestBody AcceptOrRejectChangeUserInfo acceptOrRejectChangeUserInfo) throws Exception {
        return userManageService.AcceptChangeUserInfo(acceptOrRejectChangeUserInfo);
    }
    @RequestMapping(value = "/getChangeInfoDetail", method = RequestMethod.POST)
    public ChangeInfoAcceptDetailsResponse getChangeInfoDetail(@RequestBody GetUserInfoRequest getUserInfoRequest) throws Exception {
        return userManageService.getChangeInfoDetail(getUserInfoRequest);
    }
    @RequestMapping(value = "/rejectChangeUserInfo", method = RequestMethod.POST)
    public boolean rejectChangeUserInfo(@RequestBody AcceptOrRejectChangeUserInfo acceptOrRejectChangeUserInfo) throws Exception {
        return userManageService.RejectChangeUserInfo(acceptOrRejectChangeUserInfo);
    }

    @RequestMapping(value = "/getAllUserInfo", method = RequestMethod.GET)
    public ResponseEntity<?> getAllUserInfo() {
        return ResponseEntity.ok(userManageService.getAllUserInfo());
    }
    @RequestMapping(value = "/getAllUserInfoActive", method = RequestMethod.GET)
    public ResponseEntity<?> getAllUserInfoActive() {
        return ResponseEntity.ok(userManageService.getAllUserInfoActive());
    }
    @RequestMapping(value = "/getManagerByDepartment", method = RequestMethod.GET)
    public List<UserInfoResponse> getManager(@RequestParam("department") String departmentId) {
        return userManageService.getManagerByDepartmentId(departmentId);
    }

    @RequestMapping(value = "/getUserAccount", method = RequestMethod.GET)
    public List<UserAccountResponse> getUserAccount(@RequestParam("userId") String userId) {
        return userManageService.getUserAccount(userId);
    }
    @RequestMapping(value = "/getUserAccountActive", method = RequestMethod.GET)
    public List<UserAccountResponse> getUserAccountActive(@RequestParam("userId") String userId) {
        return userManageService.getUserAccountActive(userId);
    }

    @RequestMapping(value = "/getAllDepartmentEmployee", method = RequestMethod.GET)
    public List<EmployeeResponse> getAllEmployeeByDepartment(@RequestParam("department_id") String id) {
        return userManageService.getAllDepartmentEmployee(id);
    }
}
