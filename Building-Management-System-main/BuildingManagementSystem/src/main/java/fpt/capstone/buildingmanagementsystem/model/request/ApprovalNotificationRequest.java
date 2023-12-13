package fpt.capstone.buildingmanagementsystem.model.request;

import fpt.capstone.buildingmanagementsystem.model.entity.User;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ApprovalNotificationRequest {

    private String ticketId;
    private User sensor;
    private User receiver;
    private TopicEnum topic;
    private boolean decision;
    private String reason;

}
