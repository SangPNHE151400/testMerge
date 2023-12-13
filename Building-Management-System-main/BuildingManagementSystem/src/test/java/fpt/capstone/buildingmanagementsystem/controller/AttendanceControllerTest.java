package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.model.request.AttendanceMessageRequest;
import fpt.capstone.buildingmanagementsystem.model.response.*;
import fpt.capstone.buildingmanagementsystem.service.AttendanceService;
import fpt.capstone.buildingmanagementsystem.service.RequestAttendanceFromService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.sql.Time;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(SpringExtension.class)
@SpringBootTest
class AttendanceControllerTest {
    @Autowired
    AttendanceService attendanceService;
    @Autowired
    RequestAttendanceFromService attendanceFromService;
    @Autowired
    AttendanceController attendanceController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAttendanceUser() {
        String userId = "3a5cccac-9490-4b9b-9e1e-16ce220b35cb";
        int month = 11;
        String year = "2023";

        GetAttendanceUserResponse response = attendanceController.getAttendanceUser(userId, month, year);

        TotalAttendanceUser expectedTotalAttendanceUser = new TotalAttendanceUser(
                "November,2023", 2, 15.0, 1.75, 13.25, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 1.63
        );

        List<DailyLogResponse> expectedDailyLogList = Arrays.asList(
                new DailyLogResponse(
                        "d2f2e1b8-253d-498b-a6ca-6e596a7ad7c2",
                        "Wednesday, November 22, 2023",
                        new Time(10, 15, 00),
                        new Time(22, 15, 00),
                        null,
                        null,
                        10.0,
                        1.75,
                        8.25,
                        true,
                        false,
                        0.0,
                        0.0,
                        true,
                        0.0,
                        1.0
                ),
                new DailyLogResponse(
                        "54ae58ad-8cb1-461b-84b5-fd42a3f1c527",
                        "Monday, November 20, 2023",
                        new Time(14,15,00),
                        new Time(20, 15, 00),
                        null,
                        null,
                        5.0,
                        0.0,
                        5.0,
                        true,
                        false,
                        0.0,
                        0.0,
                        true,
                        0.0,
                        0.63
                )
        );

        assertEquals(expectedTotalAttendanceUser, response.getTotalAttendanceUser());
        assertEquals(expectedDailyLogList, response.getDailyLogList());

    }

    @Test
    void testGetAttendanceUser_BadRequest() {
        String userId = null;
        int month = 11;
        String year = "2023";

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> attendanceController.getAttendanceUser(userId, month, year));

        assertEquals("request_fail", exception.getMessage());

    }

    @Test
    void testGetAttendanceUser_NotFound() {
        String userId = "3a5cccac-9490-4b9b-9e1e-16ce220b35cb";
        int month = 1;
        String year = "2022";

        NotFound exception = org.junit.jupiter.api.Assertions.assertThrows(NotFound.class,
                () -> attendanceController.getAttendanceUser(userId, month, year));

        assertEquals("list_null", exception.getMessage());

    }

//    @Test
//    void testGetAttendanceUserDetail() {
//        String user_id = "3a5cccac-9490-4b9b-9e1e-16ce220b35cb";
//        String date = "2023-11-22";
//
//        AttendanceDetailResponse result = attendanceController.getAttendanceUserDetail(user_id, date);
//
//        AttendanceDetailResponse expectedResponse = new AttendanceDetailResponse(
//                "unknown unknown",
//                "managersecurity",
//                "security",
//                "Wednesday, November 22, 2023",
//                new Time(10, 15, 00),
//                new Time(22, 15, 00),
//                10.0,
//                1.75,
//                8.25,
//                true,
//                false,
//                0.0,
//                false,
//                0.0,
//                Arrays.asList(
//                        new ControlLogResponse("managersecurity", "2023-11-22 09:15:00.0"),
//                        new ControlLogResponse("managersecurity", "2023-11-22 21:15:00.0")
//                )
//        );
//
//        assertEquals(expectedResponse, result);
//    }

    @Test
    void testGetAttendanceUserDetail_BadRequest() {
        String user_id = "not exist";
        String date = "2023-11-70";

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> attendanceController.getAttendanceUserDetail(user_id, date));

        assertEquals("request_fail", exception.getMessage());
    }

    @Test
    void testGetAttendanceUserDetail_NotFound() {
        String user_id = "3a5cccac-9490-4b9b-9e1e-16ce220b35cb";
        String date = "2023-11-25";

        NotFound exception = org.junit.jupiter.api.Assertions.assertThrows(NotFound.class,
                () -> attendanceController.getAttendanceUserDetail(user_id, date));

        assertEquals("request_fail", exception.getMessage());
    }

    @Test
    void testAcceptAttendanceRequest() {
        AttendanceMessageRequest attendanceMessageRequest = new AttendanceMessageRequest();
        attendanceMessageRequest.setAttendanceRequestId("96486e20-0421-432a-aa43-b74f5275bb5c");

        ResponseEntity<?> result = attendanceController.acceptAttendanceRequest(attendanceMessageRequest);
        Assertions.assertEquals(true, result);
    }

    @Test
    void testAcceptAttendanceRequest_NotFoundAttendanceID() {
        AttendanceMessageRequest attendanceMessageRequest = new AttendanceMessageRequest();
        attendanceMessageRequest.setAttendanceRequestId("not exist");

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> attendanceController.acceptAttendanceRequest(attendanceMessageRequest));

        assertEquals("Not_found_attendance_id", exception.getMessage());
    }



    @Test
    void testRejectAttendanceRequest() {
        AttendanceMessageRequest attendanceMessageRequest =  new AttendanceMessageRequest();
        attendanceMessageRequest.setAttendanceRequestId("9c3b3609-355d-4f1f-83f1-134e967fa881");
        attendanceMessageRequest.setContent("reject");

        boolean result = attendanceController.rejectAttendanceRequest(attendanceMessageRequest);
        Assertions.assertEquals(true, result);
    }

    @Test
    void testRejectAttendanceRequest_NotFoundForm() {
        AttendanceMessageRequest attendanceMessageRequest =  new AttendanceMessageRequest();
        attendanceMessageRequest.setAttendanceRequestId("notexist");

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> attendanceController.rejectAttendanceRequest(attendanceMessageRequest));
        assertEquals("Not_found_form", exception.getMessage());
    }
    //note fix
}
