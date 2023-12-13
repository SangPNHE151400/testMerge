package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.request.LeaveMessageRequest;
import fpt.capstone.buildingmanagementsystem.service.RequestLeaveFormService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
class LeaveFormControllerTest {
    @Autowired
    RequestLeaveFormService leaveFormService;
    @Autowired
    LeaveFormController leaveFormController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAcceptLeaveRequest() {
        LeaveMessageRequest leaveMessageRequest = new LeaveMessageRequest();
        leaveMessageRequest.setLeaveRequestId("53c5676d-58bf-4633-81f9-2e1e4d7e0266");
        leaveMessageRequest.setContent("oke cho m nghi");

        boolean result = leaveFormController.acceptLeaveRequest(leaveMessageRequest);
        assertEquals(true, result);
    }
    //re-test

    @Test
    void testRejectLeaveRequest() {
        LeaveMessageRequest leaveMessageRequest = new LeaveMessageRequest();
        leaveMessageRequest.setLeaveRequestId("53c5676d-58bf-4633-81f9-2e1e4d7e0266");
        leaveMessageRequest.setContent("ban da bi reject");

        boolean result = leaveFormController.rejectLeaveRequest(leaveMessageRequest);
        assertEquals(true, result);
    }
}
