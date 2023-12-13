package fpt.capstone.buildingmanagementsystem.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateNotificationRequest {
    String notificationId;
    String buttonStatus;
    String userId;
    String title;
    boolean sendAllStatus;
    List<String> deleteImage;
    List<String> deleteFileId;
    List<String> receiverId;
    boolean priority;
    String content;
    String uploadDatePlan;
}
