package fpt.capstone.buildingmanagementsystem.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SendLateFormRequest {
    String userId;
    String ticketId;
    String requestId;
    String title;
    String lateType;
    String lateDuration;
    String requestDate;
    String content;
    String departmentId;
    String receivedId;
}
