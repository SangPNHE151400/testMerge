package fpt.capstone.buildingmanagementsystem.model.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RoomBookingRequest {
    String roomBookingFormRoomId;

    String content;
}
