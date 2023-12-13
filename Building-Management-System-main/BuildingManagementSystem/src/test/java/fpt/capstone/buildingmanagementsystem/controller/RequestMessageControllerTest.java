package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.service.RequestMessageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.junit.Assert.assertEquals;

@ExtendWith(SpringExtension.class)
@SpringBootTest
class RequestMessageControllerTest {
    @Autowired
    RequestMessageService requestMessageService;
    @Autowired
    RequestMessageController requestMessageController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllAttendanceMessageByRequestId() {
        String requestID = "AT_d3fdddfc-bb94-48c5-80a8-552e855525cf";
        List<Object> result = requestMessageController.getAllAttendanceMessageByRequestId(requestID);

        assertEquals(2, result.size());
    }
    //update message

    @Test
    void testGetAllRoomBookingMessageByRequestId() {
        String requestID = "RB_7a58fdb8-3875-44dd-a1e4-c332ee6d36c3";

        List<Object> result = requestMessageController.getAllRoomBookingMessageByRequestId(requestID);
        assertEquals(2, result.size());
    }

    @Test
    void testGetAllLeaveMessageByRequestId() {
        String requestID = "LV_c5b73249-b1c1-4b44-bb07-7dbf44b05ad8";
        List<Object> result = requestMessageController.getAllLeaveMessageByRequestId(requestID);
        assertEquals(2, result.size());
    }

    @Test
    void testGetAllOtherMessageByRequestId() {
        String requestID = "OR_8c58fcbb-240e-413b-9eb0-e02a8d02aefe";

        List<Object> result = requestMessageController.getAllOtherMessageByRequestId(requestID);
        assertEquals(2, result.size());
    }
    //test round 2
}