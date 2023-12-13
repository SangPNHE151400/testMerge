package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.request.ControlLogAndStrangerLogSearchRequest;
import fpt.capstone.buildingmanagementsystem.model.request.RoomBookingRequest;
import fpt.capstone.buildingmanagementsystem.model.response.*;
import fpt.capstone.buildingmanagementsystem.service.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;

@RestController
@CrossOrigin
public class SecurityController {
    @Autowired
    SecurityService securityService;
    @GetMapping("listAllDevice")
    public List<LoadDeviceResponse> listAllDevice() {
        return securityService.listAllDevice();
    }

    @PostMapping("getListControlLogByDayAndDevice")
    public List<ControlLogSecurityResponse> getListControlLogByDayAndDevice(@RequestBody ControlLogAndStrangerLogSearchRequest controlLogAndStrangerLogSearchRequest) throws ParseException {
        return securityService.getListControlLogByDayAndDevice(controlLogAndStrangerLogSearchRequest);
    }
    @PostMapping("getListStrangerLogByDayAndDevice")
    public List<StrangerLogSecurityResponse> getListStrangerLogByDayAndDevice(@RequestBody ControlLogAndStrangerLogSearchRequest controlLogAndStrangerLogSearchRequest) throws ParseException {
        return securityService.getListStrangerLogByDayAndDevice(controlLogAndStrangerLogSearchRequest);
    }
    @GetMapping("getControlLogDetail")
    public ControlLogDetailResponse getControlLogDetail(@RequestParam("username") String username,@RequestParam("controlLogId") String controlLogId) {
        return securityService.getControlLogDetail(username,controlLogId);
    }
    @GetMapping("listAllControlLogByStaff")
    public List<ListAllControlLogByStaffResponse> listAllControlLogByStaff() {
        return securityService.listAllControlLogByStaff();
    }
    @GetMapping("getListControlLogByAccount")
    public ControlLogInfo getListControlLogByAccount(@RequestParam("username") String username) {
        return securityService.getListControlLogByAccount(username);
    }
}
