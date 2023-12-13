package fpt.capstone.buildingmanagementsystem.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SendWorkingOutSideRequest {
    String userId;
    String ticketId;
    String requestId;
    String date;
    String topic;
    String type;
    String title;
    String content;
    String departmentId;
    String receivedId;
}
