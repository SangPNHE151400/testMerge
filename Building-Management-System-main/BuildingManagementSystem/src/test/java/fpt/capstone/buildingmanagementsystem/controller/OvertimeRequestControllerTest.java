package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.request.OvertimeMessageRequest;
import fpt.capstone.buildingmanagementsystem.service.OvertimeRequestFormService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.Assert.assertEquals;

@ExtendWith(SpringExtension.class)
@SpringBootTest
class OvertimeRequestControllerTest {
    @Autowired
    OvertimeRequestFormService overtimeRequestFormService;
    @Autowired
    OvertimeRequestController overtimeRequestController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAcceptOvertimeRequest() {
        OvertimeMessageRequest overtimeMessageRequest = new OvertimeMessageRequest();
        overtimeMessageRequest.setOverTimeRequestId("8a4b0adb-c931-401a-b1ec-d7561486e72d");

        boolean result = overtimeRequestController.acceptOvertimeRequest(overtimeMessageRequest);
        assertEquals(true, result);
    }

    @Test
    void testRejectOvertimeRequest() {
        OvertimeMessageRequest overtimeMessageRequest = new OvertimeMessageRequest();
        overtimeMessageRequest.setOverTimeRequestId("557e796e-b261-4953-88f5-db8029485587");
        overtimeMessageRequest.setContent("m bi reject OT ce3f to 50a6 Tech1 2");

        boolean result = overtimeRequestController.rejectOvertimeRequest(overtimeMessageRequest);
        assertEquals(true, result);
    }
}
