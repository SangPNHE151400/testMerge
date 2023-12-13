package fpt.capstone.buildingmanagementsystem.model.response;

import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class NotificationResponse {
    private String notificationId;

    private String title;

    private Date uploadDate;

    private boolean readStatus;

    private String userId;

    private Department department;

}
