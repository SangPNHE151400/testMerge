package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.ServerError;
import fpt.capstone.buildingmanagementsystem.model.entity.*;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.NotificationStatus;
import fpt.capstone.buildingmanagementsystem.model.request.AcceptOrRejectChangeUserInfo;
import fpt.capstone.buildingmanagementsystem.model.request.ApprovalNotificationEvaluate;
import fpt.capstone.buildingmanagementsystem.model.request.ApprovalNotificationRequest;
import fpt.capstone.buildingmanagementsystem.model.response.NotificationAcceptResponse;
import fpt.capstone.buildingmanagementsystem.repository.DepartmentRepository;
import fpt.capstone.buildingmanagementsystem.repository.NotificationReceiverRepository;
import fpt.capstone.buildingmanagementsystem.repository.NotificationRepository;
import fpt.capstone.buildingmanagementsystem.repository.UnreadMarkRepository;
import fpt.capstone.buildingmanagementsystem.repository.UserRepository;
import fpt.capstone.buildingmanagementsystem.until.Until;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class AutomaticNotificationService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    NotificationRepository notificationRepository;

    @Autowired
    UnreadMarkRepository unreadMarkRepository;

    @Autowired
    NotificationReceiverRepository notificationReceiverRepository;

    @Autowired
    DepartmentRepository departmentRepository;

    public NotificationAcceptResponse sendApprovalRequestNotification(ApprovalNotificationRequest request) {

        String notificationTitle = "[SYSTEM] New update about " + request.getTopic() + " request";

        String notificationContent = "" +
                "Ticket Id: " + request.getTicketId() + "<br>" +
                "Topic: " + request.getTopic() + "<br>";
        if (request.isDecision()) {
            notificationContent += "Status: Accepted";
        } else {
            notificationContent += "" +
                    "Status: Rejected <br>" +
                    "Reason: " + request.getReason();
        }

        Notification notification = Notification.builder()
                .title(notificationTitle)
                .content(notificationContent)
                .notificationStatus(NotificationStatus.UPLOADED)
                .priority(false)
                .createDate(Until.generateRealTime())
                .updateDate(Until.generateRealTime())
                .uploadDate(Until.generateRealTime())
                .createdBy(request.getSensor())
                .build();

        UnreadMark unreadMark = UnreadMark.builder()
                .notification(notification)
                .user(request.getReceiver())
                .build();

        NotificationReceiver notificationReceiver = NotificationReceiver.builder()
                .notification(notification)
                .receiver(request.getReceiver())
                .build();

        NotificationAcceptResponse response = NotificationAcceptResponse.builder()
                .userId(request.getSensor().getUserId())
                .receiverId(request.getReceiver().getUserId())
                .senderName(request.getReceiver().getAccount().getUsername())
                .readStatus(false)
                .title(notificationTitle)
                .uploadDate(Until.generateRealTime())
                .build();

        Department department = departmentRepository.findByUserId(response.getUserId())
                .orElseThrow(() -> new BadRequest("Not_found_department"));
        response.setDepartment(department);
        try {
            Notification notificationResponse = notificationRepository.saveAndFlush(notification);
            unreadMarkRepository.save(unreadMark);
            notificationReceiverRepository.save(notificationReceiver);
            response.setNotificationId(notificationResponse.getNotificationId());
            return response;
        } catch (Exception e) {
            throw new ServerError("Fail");
        }
    }

    public void sendApprovalTicketNotification(ApprovalNotificationRequest request) {

        String notificationTitle = "[SYSTEM] You have a new ticket request.";

        String notificationContent = "" +
                "Ticket Id: " + request.getTicketId() + "<br>" +
                "Topic: " + request.getTopic() + "\n";

        Notification notification = Notification.builder()
                .title(notificationTitle)
                .content(notificationContent)
                .notificationStatus(NotificationStatus.UPLOADED)
                .priority(false)
                .createDate(Until.generateRealTime())
                .updateDate(Until.generateRealTime())
                .uploadDate(Until.generateRealTime())
                .createdBy(request.getSensor())
                .build();

        UnreadMark unreadMark = UnreadMark.builder()
                .notification(notification)
                .user(request.getReceiver())
                .build();

        NotificationReceiver notificationReceiver = NotificationReceiver.builder()
                .notification(notification)
                .receiver(request.getReceiver())
                .build();

        try {
            notificationRepository.saveAndFlush(notification);
            unreadMarkRepository.save(unreadMark);
            notificationReceiverRepository.save(notificationReceiver);
        } catch (Exception e) {
            throw new ServerError("Fail");
        }
    }
    public void sendChangeNotification(AcceptOrRejectChangeUserInfo request, String status) {
        String userId = request.getUserId();
        String hrId = request.getHrId();
        Optional<User> user = userRepository.findByUserId(userId);
        Optional<User> hr = userRepository.findByUserId(hrId);
        String notificationTitle = "[SYSTEM] You have a new notification.";
        String notificationContent = "The new personal information you want to update has been"+" "+status+" "+"by"+" "+hr.get().getAccount().getUsername();
        Notification notification = Notification.builder()
                .title(notificationTitle)
                .content(notificationContent)
                .notificationStatus(NotificationStatus.UPLOADED)
                .priority(false)
                .createDate(Until.generateRealTime())
                .updateDate(Until.generateRealTime())
                .uploadDate(Until.generateRealTime())
                .createdBy(hr.get())
                .build();

        UnreadMark unreadMark = UnreadMark.builder()
                .notification(notification)
                .user(user.get())
                .build();

        NotificationReceiver notificationReceiver = NotificationReceiver.builder()
                .notification(notification)
                .receiver(user.get())
                .build();

        try {
            notificationRepository.saveAndFlush(notification);
            unreadMarkRepository.save(unreadMark);
            notificationReceiverRepository.save(notificationReceiver);
        } catch (Exception e) {
            throw new ServerError("Fail");
        }
    }

    public NotificationAcceptResponse sendApprovalEvaluateRequest(ApprovalNotificationEvaluate request) {

        String notificationTitle = "Evaluate Status Approval.";
        String decision = request.isDecision() ? "Accepted" : "Rejected";
        String notificationContent = "Evaluate of employee " + request.getEmployee().getAccount().getUsername()
                + " are " + decision + " by Hr\n";
        if(!request.getHrNote().isEmpty()) {
            notificationContent += "HR note: " + request.getHrNote();
        }

        Notification notification = Notification.builder()
                .title(notificationTitle)
                .content(notificationContent)
                .notificationStatus(NotificationStatus.UPLOADED)
                .priority(false)
                .createDate(Until.generateRealTime())
                .updateDate(Until.generateRealTime())
                .uploadDate(Until.generateRealTime())
                .createdBy(request.getSender())
                .build();

        UnreadMark unreadMark = UnreadMark.builder()
                .notification(notification)
                .user(request.getManager())
                .build();

        NotificationReceiver notificationManagerReceiver = NotificationReceiver.builder()
                .notification(notification)
                .receiver(request.getManager())
                .build();

        NotificationReceiver notificationEmployeeReceiver = NotificationReceiver.builder()
                .notification(notification)
                .receiver(request.getEmployee())
                .build();

        NotificationAcceptResponse response = NotificationAcceptResponse.builder()
                .userId(request.getSender().getUserId())
                .receiverId(request.getManager().getUserId())
                .senderName(request.getManager().getAccount().getUsername())
                .readStatus(false)
                .title(notificationTitle)
                .uploadDate(Until.generateRealTime())
                .build();

        Department department = departmentRepository.findByUserId(response.getUserId())
                .orElseThrow(() -> new BadRequest("Not_found_department"));
        response.setDepartment(department);
        try {
            Notification notificationResponse = notificationRepository.saveAndFlush(notification);
            unreadMarkRepository.save(unreadMark);
            notificationReceiverRepository.saveAll(List.of(notificationManagerReceiver, notificationEmployeeReceiver));
            response.setNotificationId(notificationResponse.getNotificationId());
            return response;
        } catch (Exception e) {
            throw new ServerError("Fail");
        }
    }
}
