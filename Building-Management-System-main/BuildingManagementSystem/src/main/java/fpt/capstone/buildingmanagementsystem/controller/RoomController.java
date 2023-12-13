package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.request.RoomBookingRequest;
import fpt.capstone.buildingmanagementsystem.model.response.RoomBookingResponse;
import fpt.capstone.buildingmanagementsystem.model.response.RoomResponse;
import fpt.capstone.buildingmanagementsystem.service.RoomBookingService;
import fpt.capstone.buildingmanagementsystem.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
public class RoomController {
    @Autowired
    private RoomService roomService;

    @Autowired
    private RoomBookingService roomBookingService;

    @GetMapping("getAllRooms")
    public List<RoomResponse> getAllRoom() {
        return roomService.getAllRoom();
    }

    @GetMapping("getRoomById")
    public ResponseEntity<?> getRoomById(@RequestParam("room_id") int roomId) {
        return ResponseEntity.ok(roomService.getRoomById(roomId));
    }

    @GetMapping("getPendingAndAcceptedRoom")
    public List<RoomBookingResponse> getPendingAndAcceptedRoom() {
        return roomBookingService.getPendingAndAcceptedRoom();
    }

    @PostMapping("acceptBookRoom")
    public boolean acceptBookRoom(@RequestBody RoomBookingRequest roomBookingFormRoomId) {
        return roomBookingService.acceptBooking(roomBookingFormRoomId.getRoomBookingFormRoomId());
    }

    @PostMapping("rejectBookRoom")
    public boolean rejectBookRoom(@RequestBody RoomBookingRequest roomBookingFormRoomId) {
        return roomBookingService.rejectRoomBooking(roomBookingFormRoomId);
    }
}
