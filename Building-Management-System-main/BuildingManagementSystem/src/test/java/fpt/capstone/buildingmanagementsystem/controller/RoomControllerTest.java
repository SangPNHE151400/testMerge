package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.model.request.RoomBookingRequest;
import fpt.capstone.buildingmanagementsystem.model.response.RoomBookingResponse;
import fpt.capstone.buildingmanagementsystem.model.response.RoomResponse;
import fpt.capstone.buildingmanagementsystem.service.RoomBookingService;
import fpt.capstone.buildingmanagementsystem.service.RoomService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@ExtendWith(SpringExtension.class)
@SpringBootTest
class RoomControllerTest {
    @Autowired
    RoomService roomService;
    @Autowired
    RoomBookingService roomBookingService;
    @Autowired
    RoomController roomController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllRoom() {
        List<RoomResponse> roomResponses = roomController.getAllRoom();

        assertNotNull(roomResponses);
        assertEquals(9, roomResponses.size());
        assertEquals("R101", roomResponses.get(0).getRoomName());
        assertEquals("R102", roomResponses.get(1).getRoomName());
        assertEquals("R103", roomResponses.get(2).getRoomName());
        assertEquals("R104", roomResponses.get(3).getRoomName());
        assertEquals("R105", roomResponses.get(4).getRoomName());
        assertEquals("R106", roomResponses.get(5).getRoomName());
        assertEquals("R107", roomResponses.get(6).getRoomName());
        assertEquals("R108", roomResponses.get(7).getRoomName());
        assertEquals("R109", roomResponses.get(8).getRoomName());
    }
    //update round2

    @Test
    void testGetRoomById() {
        int roomID = 2;

        ResponseEntity<?> result = roomController.getRoomById(2);

        assertEquals(200, result.getStatusCodeValue());
        assertTrue(result.getBody() instanceof RoomResponse);
        RoomResponse roomResponse = (RoomResponse) result.getBody();
        assertEquals("R102", roomResponse.getRoomName());
    }

    @Test
    void testGetRoomById_NotFoundRoom() {
        int roomID = 2002;

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> roomController.getRoomById(roomID));
        Assertions.assertEquals("not_found_room", exception.getMessage());
    }

    @Test
    void testGetPendingAndAcceptedRoom() {
        List<RoomBookingResponse> result = roomController.getPendingAndAcceptedRoom();

        Assertions.assertEquals(4, result.size());
    }
    //change expected

    @Test
    void testAcceptBookRoom() {
        RoomBookingRequest roomBookingFormRoomId = new RoomBookingRequest(
                "8e0e0cd2-d2c0-4d93-8ff0-58481d2fe051",
                null);

        boolean result = roomController.acceptBookRoom(roomBookingFormRoomId);
        Assertions.assertEquals(true, result);
    }

    @Test
    void testAcceptBookRoom_NotFoundBookingID() {
        RoomBookingRequest roomBookingFormRoomId = new RoomBookingRequest(
                "notexistID",
                null);

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> roomController.acceptBookRoom(roomBookingFormRoomId));

        Assertions.assertEquals("Not_found_form", exception.getMessage());
    }


    @Test
    void testRejectBookRoom() {
        RoomBookingRequest roomBookingFormRoomId = new RoomBookingRequest(
                "b441d24f-77ef-4128-bd20-504e592d44e3",
                "");

        boolean result = roomController.rejectBookRoom(roomBookingFormRoomId);
        Assertions.assertEquals(true, result);
    }

    @Test
    void testRejectBookRoom_NotFoundBookingID() {
        RoomBookingRequest roomBookingFormRoomId = new RoomBookingRequest(
                "notexistID",
                "");

        BadRequest exception = org.junit.jupiter.api.Assertions.assertThrows(BadRequest.class,
                () -> roomController.rejectBookRoom(roomBookingFormRoomId));

        Assertions.assertEquals("Not_found_form", exception.getMessage());
    }
}
