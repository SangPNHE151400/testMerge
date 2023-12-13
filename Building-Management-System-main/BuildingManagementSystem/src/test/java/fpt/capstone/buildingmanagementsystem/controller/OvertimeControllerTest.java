package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.model.response.GetOvertimeListResponse;
import fpt.capstone.buildingmanagementsystem.model.response.OverTimeLogResponse;
import fpt.capstone.buildingmanagementsystem.model.response.SystemTimeResponse;
import fpt.capstone.buildingmanagementsystem.service.OvertimeService;
import fpt.capstone.buildingmanagementsystem.until.Until;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.sql.Date;
import java.sql.Time;
import java.text.ParseException;
import java.util.Arrays;

import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.DateType.NORMAL;
import static org.junit.Assert.assertEquals;

@ExtendWith(SpringExtension.class)
@SpringBootTest
class OvertimeControllerTest {
    @Autowired
    OvertimeService overtimeService;
    @Autowired
    OvertimeController overtimeController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetOvertimeListUser() throws ParseException {
        String user_id = "55fd796e-6e33-4b17-b6d9-d32aef9fce3f";
        String month = "11";
        String year = "2023";

        Date approved_date = Until.convertStringToDate("2023-11-22");

        GetOvertimeListResponse result = overtimeController.getOvertimeListUser(user_id, month, year);

        GetOvertimeListResponse expectedResponse = new GetOvertimeListResponse(
                "emptech1",
                "tech D1",
                "November,2023",
                Arrays.asList(
                        new OverTimeLogResponse(
                                "Tuesday, November 21, 2023",
                                new Time(19, 45, 00),
                                new Time(23, 15, 00),
                                NORMAL,
                                new Time(18, 00, 00),
                                new Time(18, 00, 00),
                                3.5,
                                approved_date,
                                7.0
                        )
                )
        );
        assertEquals(expectedResponse, result);
    }
    //update  expected

    @Test
    void testGetOvertimeListUser_UserIdNull(){
        String user_id = null;
        String month = "11";
        String year = "2023";

        NotFound exception = org.junit.jupiter.api.Assertions.assertThrows(NotFound.class,
                () -> overtimeController.getOvertimeListUser(user_id, month, year));
        Assertions.assertEquals("user_id_null", exception.getMessage());
    }
    //try exception

    @Test
    void testGetOvertimeListUser_ListNull(){
        String user_id = "0dff5d5c-095d-4386-91f2-82bdb7eba342";
        String month = "11";
        String year = null;

        NotFound exception = org.junit.jupiter.api.Assertions.assertThrows(NotFound.class,
                () -> overtimeController.getOvertimeListUser(user_id, month, year));
        Assertions.assertEquals("list_null", exception.getMessage());
    }
    //catch notfound

    @Test
    void testGetOvertimeSystem() throws ParseException {
        String user_id = "f2dbbf96-1a65-4e72-805d-ee10ca9b50a6";
        String date = "2023-11-21";

        Date dateconvert = Until.convertStringToDate(date);

        SystemTimeResponse result = overtimeController.getOvertimeSystem(user_id, dateconvert);
        assertEquals(dateconvert, result.getDate());
        assertEquals(new Time(18, 00, 00), result.getSystemCheckin());
        assertEquals(new Time(19, 00, 00), result.getSystemCheckout());
    }

    @Test
    void testGetOvertimeSystem_BadRequest() throws ParseException {
        String user_id = null;
        String date = "2023-11-21";

        Date dateconvert = Until.convertStringToDate(date);

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> overtimeController.getOvertimeSystem(user_id, dateconvert));
        Assertions.assertEquals("Not_found_user", exception.getMessage());

    }
}
