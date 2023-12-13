package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.request.AttendanceMessageRequest;
import fpt.capstone.buildingmanagementsystem.model.response.AttendanceDetailResponse;
import fpt.capstone.buildingmanagementsystem.model.response.FilePdfResponse;
import fpt.capstone.buildingmanagementsystem.model.response.GetAttendanceUserResponse;
import fpt.capstone.buildingmanagementsystem.service.AttendanceDetailPDFService;
import fpt.capstone.buildingmanagementsystem.service.AttendanceService;
import fpt.capstone.buildingmanagementsystem.service.RequestAttendanceFromService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.FileOutputStream;
import java.io.IOException;

@RestController
@CrossOrigin
public class AttendanceController {
    @Autowired
    AttendanceService attendanceService;
    @Autowired
    AttendanceDetailPDFService attendanceDetailPDFService;
    @Autowired
    RequestAttendanceFromService attendanceFromService;

    @GetMapping("/getAttendanceUser")
    public GetAttendanceUserResponse getAttendanceUser(@Param("user_id") String user_id, @Param("month") int month, @Param("month") String year) {
        return attendanceService.getAttendanceUser(user_id, month, year);
    }

    @GetMapping("/getAttendanceUserDetail")
    public AttendanceDetailResponse getAttendanceUserDetail(@Param("user_id") String user_id, @Param("date") String date) {
        return attendanceService.getAttendanceDetail(user_id, date);
    }
    @GetMapping("/exportAttendanceUserDetail")
    public FilePdfResponse exportAttendanceUserDetail(@Param("user_id") String user_id, @Param("date") String date) throws IOException {
        return attendanceDetailPDFService.export(user_id, date);
    }

    @PostMapping("/acceptAttendanceRequest")
    public ResponseEntity<?> acceptAttendanceRequest(@RequestBody AttendanceMessageRequest attendanceMessageRequest) {
        return ResponseEntity.ok(attendanceFromService.acceptAttendanceRequest(attendanceMessageRequest.getAttendanceRequestId()));
    }

    @PostMapping("/rejectAttendanceRequest")
    public boolean rejectAttendanceRequest(@RequestBody AttendanceMessageRequest attendanceMessageRequest) {
        return attendanceFromService.rejectAttendanceRequest(attendanceMessageRequest);
    }
}
