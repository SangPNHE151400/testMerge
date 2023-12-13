package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.ControlLogStatus;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.DeviceStatus;
import fpt.capstone.buildingmanagementsystem.model.request.AccountDeviceRequest;
import fpt.capstone.buildingmanagementsystem.model.request.ChangeRecordStatusRequest;
import fpt.capstone.buildingmanagementsystem.model.request.DeviceRoomRequest;
import fpt.capstone.buildingmanagementsystem.model.request.DeviceStatusRequest;
import fpt.capstone.buildingmanagementsystem.model.response.AccountLcdResponse;
import fpt.capstone.buildingmanagementsystem.model.response.DeviceAccountResponse;
import fpt.capstone.buildingmanagementsystem.model.response.DeviceRoomResponse;
import fpt.capstone.buildingmanagementsystem.model.response.RoomResponse;
import fpt.capstone.buildingmanagementsystem.service.DeviceService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;

import static org.mockito.Mockito.*;

class DeviceControllerTest {
    @Mock
    DeviceService deviceService;
    @InjectMocks
    DeviceController deviceController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateDeviceAccount() {
        when(deviceService.registerNewAccount(any())).thenReturn(null);

        ResponseEntity<?> result = deviceController.createDeviceAccount(new AccountDeviceRequest("accountId", "roomIdString", "startDate", "endDate"));
        Assertions.assertEquals(null, result);
    }
    //pass

    @Test
    void testUpdateDevice() {
        when(deviceService.updateDevice(any())).thenReturn(null);

        ResponseEntity<?> result = deviceController.updateDevice(new DeviceRoomRequest("deviceId", "newRoomId", "deviceName", "deviceLcdId", "deviceUrl"));
        Assertions.assertEquals(null, result);
    }
    //fixed conflict

    @Test
    void testUpdateDeviceStatus() {
        when(deviceService.updateDeviceStatus(any())).thenReturn(null);

        ResponseEntity<?> result = deviceController.updateDeviceStatus(new DeviceStatusRequest("id", DeviceStatus.ACTIVE, "deviceNote"));
        Assertions.assertEquals(null, result);
    }
    //pass

    @Test
    void testChangeRecordStatus() {
        when(deviceService.changeRecordStatus(any())).thenReturn(null);

        ResponseEntity<?> result = deviceController.changeRecordStatus(new ChangeRecordStatusRequest("deviceAccountId", ControlLogStatus.WHITE_LIST));
        Assertions.assertEquals(null, result);
    }
    //update expected
}