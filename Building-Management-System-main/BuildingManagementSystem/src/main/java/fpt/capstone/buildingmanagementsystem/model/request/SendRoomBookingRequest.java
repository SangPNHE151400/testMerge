package fpt.capstone.buildingmanagementsystem.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.sql.Time;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class SendRoomBookingRequest {
    private String userId;
    private String ticketId;
    private String requestId;
    private String departmentSenderId;
    private int roomId;
    private String title;
    private String content;
    private String bookingDate;
    private String startTime;
    private String endTime;
    String receiverId;
    String departmentReceiverId;
}
