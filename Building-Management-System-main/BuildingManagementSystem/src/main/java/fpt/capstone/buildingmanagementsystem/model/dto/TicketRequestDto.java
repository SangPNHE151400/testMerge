package fpt.capstone.buildingmanagementsystem.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class TicketRequestDto {
    private String ticketId;
    private Date createDate;
    private Date updateDate;
    private boolean status;
    String topic;
    private String requestId;
    private String title;
    private Date requestCreateDate;
    private Date requestUpdateDate;
    private String requestStatus;
    private String senderId;
    private String receiverId;
    private Date messageCreateDate;
    private String messageId;
    private String departmentId;
    private String departmentName;
    private String senderFirstName;
    private String senderLastName;
    private String receiverFirstName;
    private String receiverLastName;
}
