package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.request.LeaveMessageRequest;
import fpt.capstone.buildingmanagementsystem.service.RequestLeaveFormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class LeaveFormController {

    @Autowired
    private RequestLeaveFormService leaveFormService;

    @PostMapping("acceptLeaveRequest")
    public boolean acceptLeaveRequest(@RequestBody LeaveMessageRequest leaveMessageRequest) {
        return leaveFormService.acceptLeaveRequest(leaveMessageRequest.getLeaveRequestId());
    }

    @PostMapping("rejectLeaveRequest")
    public boolean rejectLeaveRequest(@RequestBody LeaveMessageRequest leaveMessageRequest) {
        return leaveFormService.rejectLeaveRequest(leaveMessageRequest);
    }
}
