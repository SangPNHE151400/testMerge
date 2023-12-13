package fpt.capstone.buildingmanagementsystem.model.request;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Time;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class TicketAttendanceRequest {
    private String title;
    private String topic;
    private String senderId;
    private String departmentId;
    private String receiverId;
    private Time manualFirstEntry;
    private Time manualLastExit;
    private String note;

}
