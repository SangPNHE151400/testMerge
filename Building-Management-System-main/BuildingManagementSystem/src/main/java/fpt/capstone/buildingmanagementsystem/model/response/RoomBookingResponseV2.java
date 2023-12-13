package fpt.capstone.buildingmanagementsystem.model.response;

import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.RoomBookingStatus;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class RoomBookingResponseV2 {
    private String roomBookingRequestId;
    private String title;
    private String content;
    private String bookingDate;
    private String startDate;
    private String endDate;
    private Department senderDepartment;
    private TopicEnum topic;
    private int roomId;
    private String roomName;
    private String requestMessageId;
    private RoomBookingStatus status;
}
