package fpt.capstone.buildingmanagementsystem.model.response;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.sql.Time;

@Getter
@Setter
public class RoomBookingResponse {
    private String id;
    private Time endDate;
    private Time startDate;
    private String title;
    private String departmentId;
    private Date bookingDate;
    private int roomId;
    private String bookingStatus;
}
