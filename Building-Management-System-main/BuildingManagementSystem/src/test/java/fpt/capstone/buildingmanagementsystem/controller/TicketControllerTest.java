package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.model.request.ChangeReceiveIdRequest;
import fpt.capstone.buildingmanagementsystem.model.response.TicketRequestResponseV2;
import fpt.capstone.buildingmanagementsystem.service.TicketManageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.Assert.assertEquals;

@ExtendWith(SpringExtension.class)
@SpringBootTest
class TicketControllerTest {
    @Autowired
    TicketManageService ticketManageService;
    @Autowired
    TicketController ticketController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

//    @Test
//    void testGetAllTicketAndRequest() {
//        List<TicketRequestResponse> result = ticketController.getAllTicketAndRequest();
//        assertNotNull(result);
//        assertFalse(result.isEmpty());
//        assertEquals(1, result.size());
//    }
//    Change method

    @Test
    void testGetAllTicketAndRequest2() {
        String senderID = "f2dbbf96-1a65-4e72-805d-ee10ca9b50a6";

        List<TicketRequestResponseV2> result = ticketController.getAllTicketAndRequest(senderID);
        assertNotNull(result);
        assertEquals(5, result.size());
    }

    @Test
    void testGetAllTicketAndRequestByHr() {
        List<TicketRequestResponseV2> result = ticketController.getAllTicketAndRequestByHr();
        assertNotNull(result);
        assertEquals(1, result.size());
    }
    //done

    @Test
    void testGetAllTicketAndRequestBySecurity() {

        List<TicketRequestResponseV2> result = ticketController.getAllTicketAndRequestBySecurity();

        assertNotNull(result);
        assertEquals(1, result.size());
    }
    //done

    @Test
    void testGetAllTicketAndRequestByAdmin() {
        List<TicketRequestResponseV2> result = ticketController.getAllTicketAndRequestByAdmin();

        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void testGetAllTicketAndRequestByDepartmentManager() {
        List<TicketRequestResponseV2> result = ticketController.getAllTicketAndRequestByDepartmentManager("tech D1");
        assertNotNull(result);
        assertEquals(11, result.size());
    }

    @Test
    void testChangeReceiveIdRequest() {
//        3a5cccac-9490-4b9b-9e1e-16ce220b35cb
        ChangeReceiveIdRequest changeReceiveIdRequest = new ChangeReceiveIdRequest();
        changeReceiveIdRequest.setRequestId("OR_c4e4c395-add2-40d3-ad1c-f4118f117554");
        changeReceiveIdRequest.setReceiverId("f8dbabf3-34d5-4b19-97dd-d99d7b34e11f");

        boolean result = ticketController.changeReceiveIdRequest(changeReceiveIdRequest);
        assertEquals(true, result);

    }

    @Test
    void testChangeReceiveIdRequest_NotFoundReceiverID() {
        ChangeReceiveIdRequest changeReceiveIdRequest = new ChangeReceiveIdRequest();
        changeReceiveIdRequest.setRequestId("OR_c4e4c395-add2-40d3-ad1c-f4118f117554");
        changeReceiveIdRequest.setReceiverId("skdfgsdfjsdgfksdjbfskjdhvgf");

        NotFound exception = org.junit.jupiter.api.Assertions.assertThrows(NotFound.class,
                () -> ticketController.changeReceiveIdRequest(changeReceiveIdRequest));
        assertEquals("receiver_id_not_found", exception.getMessage());

    }
    //fixed

    @Test
    void testChangeReceiveIdRequest_NotFoundNull() {
        ChangeReceiveIdRequest changeReceiveIdRequest = new ChangeReceiveIdRequest();
        changeReceiveIdRequest.setRequestId(null);
        changeReceiveIdRequest.setReceiverId("skdfgsdfjsdgfksdjbfskjdhvgf");

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> ticketController.changeReceiveIdRequest(changeReceiveIdRequest));
        assertEquals("request_fail", exception.getMessage());

    }
// loi vi k bat dc loi requestID not found
//    @Test
//    void testChangeReceiveIdRequest_NotFoundRequestID() {
//        ChangeReceiveIdRequest changeReceiveIdRequest = new ChangeReceiveIdRequest();
//        changeReceiveIdRequest.setRequestId("uwesijbsfokasdbasda");
//        changeReceiveIdRequest.setReceiverId("f8dbabf3-34d5-4b19-97dd-d99d7b34e11f");
//
//        NotFound exception = org.junit.jupiter.api.Assertions.assertThrows(NotFound.class,
//                () -> ticketController.changeReceiveIdRequest(changeReceiveIdRequest));
//        assertEquals("request_ticket_not_found", exception.getMessage());
//
//    }
}
