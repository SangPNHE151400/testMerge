package fpt.capstone.buildingmanagementsystem.model.response;

import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import fpt.capstone.buildingmanagementsystem.model.entity.Role;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.NotificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class NotificationDetailResponseForDetail {

    private String notificationId;
    private String title;
    private String content;
    private Date createdDate;
    private Date uploadDate;
    private NotificationStatus notificationStatus;
    private boolean priority;
    private String creatorId;
    private String firstName;
    private String lastName;
    private Role role;
    private String userName;
    private Department creatorDepartment;
    private String creatorImage;
    private boolean personalPriority;

    private List<NotificationFileResponse> notificationFiles;

    private List<NotificationImageResponse> notificationImages;

}
