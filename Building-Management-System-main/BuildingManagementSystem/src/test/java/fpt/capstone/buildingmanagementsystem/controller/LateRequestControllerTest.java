package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.request.LateMessageRequest;
import fpt.capstone.buildingmanagementsystem.service.LateRequestService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest
class LateRequestControllerTest {
    @Autowired
    LateRequestService lateRequestService;
    @Autowired
    LateRequestController lateRequestController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAcceptLateRequest() {
        LateMessageRequest lateMessageRequest = new LateMessageRequest();
        lateMessageRequest.setLateMessageRequestId("34c48221-3718-4fa7-8fff-186382512978");

        boolean result = lateRequestController.acceptLateRequest(lateMessageRequest);
        Assertions.assertEquals(true, result);
    }
    // note hot fix

    @Test
    void testRejectLateRequest() {
        LateMessageRequest lateMessageRequest = new LateMessageRequest();
        lateMessageRequest.setLateMessageRequestId("d7a24608-edc8-428d-b57f-a0a0db560c3f");
        lateMessageRequest.setContent("reject Lateform to secu depart 2v3");

        boolean result = lateRequestController.rejectLateRequest(lateMessageRequest);
        Assertions.assertEquals(true, result);
    }
    //fixedreject
}
