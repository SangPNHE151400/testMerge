package fpt.capstone.buildingmanagementsystem.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaveNotificationRequest {
    String buttonStatus;
    String userId;
    String title;
    boolean sendAllStatus;
    List<String> receiverId;
    boolean priority;
    String content;
    String uploadDatePlan;
}
