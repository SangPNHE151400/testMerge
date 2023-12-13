package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.request.WorkingOutsideRequest;
import fpt.capstone.buildingmanagementsystem.service.RequestWorkingOutsideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class RequestWorkingOutsideController {

    @Autowired
    RequestWorkingOutsideService workingOutsideService;

    @PostMapping("acceptWorkingOutside")
    public boolean acceptWorkingOutside(@RequestBody WorkingOutsideRequest workingOutsideRequest) {
        return workingOutsideService.acceptWorkingOutsideRequest(workingOutsideRequest.getWorkOutsideRequestId());
    }

    @PostMapping("rejectWorkingOutside")
    public boolean rejectWorkingOutside(@RequestBody WorkingOutsideRequest workingOutsideRequest) {
        return workingOutsideService.rejectWorkingOutside(workingOutsideRequest);
    }
}
