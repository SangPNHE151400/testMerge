package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.service.RequestMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
public class RequestMessageController {

    @Autowired
    RequestMessageService requestMessageService;

    @GetMapping("getAttendanceMessage")
    public List<Object> getAllAttendanceMessageByRequestId(@RequestParam("request_id") String requestId) {
        return requestMessageService.getAllAttendanceMessageByRequestId(requestId);
    }

    @GetMapping("getRoomBookingMessage")
    List<Object> getAllRoomBookingMessageByRequestId(@RequestParam("request_id") String requestId) {
        return requestMessageService.getAllRoomBookingMessageByRequestId(requestId);
    }

    @GetMapping("getOverTimeMessage")
    List<Object> getAllOvertimeRequestMessageByRequestId(@RequestParam("request_id") String requestId) {
        return requestMessageService.getAllOvertimeRequestMessageByRequestId(requestId);
    }

    @GetMapping("getLateRequestMessage")
    List<Object> getAllLateRequestMessageByRequestId(@RequestParam("request_id") String requestId) {
        return requestMessageService.getAllLateRequestMessageByRequestId(requestId);
    }

    @GetMapping("getWorkingOutsideMessage")
    List<Object> getAllWorkingOutsideRequestMessageByRequestId(@RequestParam("request_id") String requestId) {
        return requestMessageService.getAllWorkingOutsideRequestMessageByRequestId(requestId);
    }

    @GetMapping("getLeaveMessage")
    List<Object> getAllLeaveMessageByRequestId(@RequestParam("request_id") String requestId) {
        return requestMessageService.getAllLeaveMessageByRequestId(requestId);
    }

    @GetMapping("getOtherMessage")
    List<Object> getAllOtherMessageByRequestId(@RequestParam("request_id") String requestId) {
        return requestMessageService.getAllOtherMessageByRequestId(requestId);
    }
}
