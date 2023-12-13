package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.request.AccountDeviceRequest;
import fpt.capstone.buildingmanagementsystem.model.request.ChangeRecordStatusRequest;
import fpt.capstone.buildingmanagementsystem.model.request.DeviceRoomRequest;
import fpt.capstone.buildingmanagementsystem.model.request.DeviceStatusRequest;
import fpt.capstone.buildingmanagementsystem.model.response.DeviceAccountResponse;
import fpt.capstone.buildingmanagementsystem.model.response.DeviceRoomResponse;
import fpt.capstone.buildingmanagementsystem.service.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
public class DeviceController {

    @Autowired
    DeviceService deviceService;

    @GetMapping("/getAllDevice")
    public List<DeviceRoomResponse> getAllDevice() {
        return deviceService.getAllDevice();
    }

    @PostMapping("/createDeviceAccount")
    public ResponseEntity<?> createDeviceAccount(@RequestBody AccountDeviceRequest request) {
        return deviceService.registerNewAccount(request);
    }

    @PostMapping("/updateDevice")
    public ResponseEntity<?> updateDevice(@RequestBody DeviceRoomRequest request) {
        return deviceService.updateDevice(request);
    }

    @PostMapping("updateDeviceStatus")
    public ResponseEntity<?> updateDeviceStatus(@RequestBody DeviceStatusRequest request) {
        return deviceService.updateDeviceStatus(request);
    }

    @GetMapping("getDeviceDetail")
    public DeviceAccountResponse getDeviceDetail(@RequestParam("device_id") String deviceId) {
        return deviceService.getDeviceDetail(deviceId);
    }

//    @PostMapping("changeAccountStatus")
//    public ResponseEntity<?> changeAccountStatus(@RequestBody ChangeStatusRequest request) {
//        return deviceService.changeAccountStatus(request);
//    }

    @PostMapping("changeRecordStatus")
    public ResponseEntity<?> changeRecordStatus(@RequestBody ChangeRecordStatusRequest request) {
        return deviceService.changeRecordStatus(request);
    }

}
