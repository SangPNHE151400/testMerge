package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.Room;
import fpt.capstone.buildingmanagementsystem.model.entity.RoomBookingFormRoom;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.RoomBookingRequestForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomBookingFormRoomRepository extends JpaRepository<RoomBookingFormRoom, String> {
    List<RoomBookingFormRoom> findByRoomRequestFormIn(List<RoomBookingRequestForm> roomBookingRequestForms);
    RoomBookingFormRoom findByRoomRequestForm(RoomBookingRequestForm roomBookingRequestForm);
    List<RoomBookingFormRoom> findByRoomRequestFormInAndRoom(List<RoomBookingRequestForm> roomBookingRequestForms, Room room);

}
