package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.response.RoomBookingResponse;

import java.util.List;

public interface RoomBookingFormRepositoryV2 {

    List<RoomBookingResponse> getPendingAndAcceptedRoom();

}
