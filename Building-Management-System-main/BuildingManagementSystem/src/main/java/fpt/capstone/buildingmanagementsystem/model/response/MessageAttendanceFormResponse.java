package fpt.capstone.buildingmanagementsystem.model.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageAttendanceFormResponse {
    private String requestMessageId;
    private String senderId;
    private String firstNameSender;
    private String lastNameSender;
    private String receiverId;
    private String firstNameReceiver;
    private String lastNameReceiver;
    private String createDate;
    private String updateDate;
    private String attachmentMessageId;
    private String departmentId;
    private String manualDate;
    private String manualFirstEntry;
    private String manualLastExit;
    private String topic;
    private String content;

}
