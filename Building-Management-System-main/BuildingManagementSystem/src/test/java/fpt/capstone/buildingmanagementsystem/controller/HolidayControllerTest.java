package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.request.HolidayDeleteRequest;
import fpt.capstone.buildingmanagementsystem.model.request.HolidaySaveRequest;
import fpt.capstone.buildingmanagementsystem.model.request.UserRequest;
import fpt.capstone.buildingmanagementsystem.model.response.HolidayResponse;
import fpt.capstone.buildingmanagementsystem.service.HolidayService;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.mockito.Mockito.*;

class HolidayControllerTest {
    @Mock
    HolidayService holidayService;
    @InjectMocks
    HolidayController holidayController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @SneakyThrows
    @Test
    void testSaveHoliday() {
        when(holidayService.saveHoliday(any())).thenReturn(true);

        boolean result = holidayController.saveHoliday(new HolidaySaveRequest("title", "content", "toDate", "fromDate", "userId"));
        Assertions.assertEquals(true, result);
    }
    //pass

    @Test
    void testDeleteHoliday() {
        when(holidayService.deleteHoliday(any())).thenReturn(true);

        boolean result = holidayController.deleteHoliday(new HolidayDeleteRequest("holidayId"));
        Assertions.assertEquals(true, result);
    }
    //pass

    @Test
    void testListAllHoliday() {
        when(holidayService.listAllHoliday()).thenReturn(List.of(new HolidayResponse("holidayId", "title", "content", null, null, "username")));

        List<HolidayResponse> result = holidayController.listAllHoliday();
        Assertions.assertEquals(List.of(new HolidayResponse("holidayId", "title", "content", null, null, "username")), result);
    }
    //pass

    @Test
    void testValidateHolidayEmail() {
        when(holidayService.sendHolidayEmail(anyString())).thenReturn(true);

        boolean result = holidayController.validateHolidayEmail(new UserRequest("userName"));
        Assertions.assertEquals(true, result);
    }
    //pass

    @Test
    void testCheckHolidayCode() {
        when(holidayService.checkHolidayCode(anyString(), anyString())).thenReturn(true);

        boolean result = holidayController.checkHolidayCode("code", "userId");
        Assertions.assertEquals(true, result);
    }
    //pass
}
//
