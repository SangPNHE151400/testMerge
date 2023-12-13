package fpt.capstone.buildingmanagementsystem.model.response;

import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.NotificationStatus;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.NotificationViewer;
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
public class NotificationDetailResponse {

    private String notificationId;
    private String title;
    private String content;
    private Date createdDate;
    private Date uploadDate;
    private NotificationStatus notificationStatus;
    private boolean priority;
    private String creatorId;
    private Department departmentUpload;
    private boolean readStatus;
    private boolean personalPriority;
    private NotificationViewer viewAs;
    private boolean containFile;
    private boolean containImage;
}
