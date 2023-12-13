package fpt.capstone.buildingmanagementsystem.model.response;

import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class NotificationAcceptResponse {
    private String notificationId;
    private String userId;
    private String receiverId;
    private String senderName;
    private boolean readStatus;
    private String title;
    private Date uploadDate;
    private Department department;
}
