package fpt.capstone.buildingmanagementsystem.model.response;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class RequestTicketResponse {
    private String requestId;
    private String title;
    private Date requestCreateDate;
    private Date requestUpdateDate;
    private String requestStatus;
    private String senderId;
    private String receiverId;
    private Date messageCreateDate;
    private String departmentId;
    private String departmentName;
    private String senderFirstName;
    private String senderLastName;
    private String receiverFirstName;
    private String receiverLastName;
}
