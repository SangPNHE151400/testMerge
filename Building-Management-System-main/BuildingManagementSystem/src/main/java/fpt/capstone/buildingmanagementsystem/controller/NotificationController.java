package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.request.NotificationDetailRequest;
import fpt.capstone.buildingmanagementsystem.model.request.PersonalPriorityRequest;
import fpt.capstone.buildingmanagementsystem.model.request.UnReadRequest;
import fpt.capstone.buildingmanagementsystem.model.response.FileDataResponse;
import fpt.capstone.buildingmanagementsystem.model.response.NotificationDetailResponse;
import fpt.capstone.buildingmanagementsystem.model.response.NotificationDetailResponseForCreator;
import fpt.capstone.buildingmanagementsystem.model.response.NotificationDetailResponseForDetail;
import fpt.capstone.buildingmanagementsystem.model.response.NotificationTitleResponse;
import fpt.capstone.buildingmanagementsystem.service.NotificationService;
import fpt.capstone.buildingmanagementsystem.service.NotificationServiceV2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin
public class NotificationController {
    @Autowired
    NotificationService notificationService;

    @Autowired
    NotificationServiceV2 notificationServiceV2;

    @RequestMapping(path = "/saveNewNotification", method = RequestMethod.POST, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public boolean saveNewNotification(@RequestParam("data") String data, @RequestParam(value = "image[]", required = false) MultipartFile[] image,
                                       @RequestParam(value = "file[]", required = false) MultipartFile[] file){
        return notificationService.saveNotification(data, image, file);
    }

    @RequestMapping(path = "/editNotification", method = RequestMethod.POST, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public boolean editNotification(@RequestParam("data") String data, @RequestParam(value = "image[]", required = false) MultipartFile[] image,
                                    @RequestParam(value = "file[]", required = false) MultipartFile[] file){
        return notificationService.changeNotification(data, image, file);
    }

    @GetMapping("/getNotificationByUserId")
    public NotificationTitleResponse getAllNotificationByUser(@RequestParam("userId") String userId) {
        return notificationServiceV2.getAllNotificationByUser(userId);
    }

    @GetMapping("/getListNotificationByCreator")
    public List<NotificationDetailResponse> getListNotificationByUserId(@RequestParam("userId") String userId) {
        return notificationServiceV2.getListNotificationByCreator(userId);
    }

    @GetMapping("/getListUploadedNotificationByCreator")
    public List<NotificationDetailResponse> getListUploadedNotificationByCreator(@RequestParam("userId") String userId) {
        return notificationServiceV2.getListUploadedNotificationByCreator(userId);
    }

    @GetMapping("/getListUploadedNotification")
    public List<NotificationDetailResponse> getListUploadedNotificationByUserId(@RequestParam("userId") String userId) {
        return notificationServiceV2.getListUploadedNotificationByUserId(userId);
    }

    @GetMapping("/getListDraftNotification")
    public List<NotificationDetailResponse> getListDraftNotificationByUserId(@RequestParam("userId") String userId) {
        return notificationServiceV2.getListDraftNotificationByCreator(userId);
    }

    @GetMapping("/getListScheduledNotification")
    public List<NotificationDetailResponse> getListScheduledNotificationByUserId(@RequestParam("userId") String userId) {
        return notificationServiceV2.getListScheduledNotificationByCreator(userId);
    }

    @PostMapping("/markToRead")
    public boolean markToReadByNotification(@RequestBody UnReadRequest unReadRequest) {
        return notificationService.markAsRead(unReadRequest.getNotificationId(), unReadRequest.getUserId());
    }

    @PostMapping("/markToUnRead")
    public boolean markToUnReadByNotification(@RequestBody UnReadRequest unReadRequest) {
        return notificationService.markAsUnRead(unReadRequest.getNotificationId(), unReadRequest.getUserId());
    }

    @PostMapping("/setPersonalPriority")
    public boolean setPersonalPriority(@RequestBody PersonalPriorityRequest personalPriorityRequest) {
        return notificationService.setPersonalPriority(personalPriorityRequest.getNotificationId(), personalPriorityRequest.getUserId());
    }

    @PostMapping("/unsetPersonalPriority")
    public boolean unsetPersonalPriority(@RequestBody PersonalPriorityRequest personalPriorityRequest) {
        return notificationService.unsetPersonalPriority(personalPriorityRequest.getNotificationId(), personalPriorityRequest.getUserId());
    }

    @PostMapping("/getNotificationDetailByReceiver")
    public NotificationDetailResponseForDetail getNotificationByUserIdAndNotificationId(@RequestBody NotificationDetailRequest detailRequest) {
        return notificationServiceV2.getNotificationDetailByUserIdAndNotificationId(detailRequest.getUserId(), detailRequest.getNotificationId());
    }

    @PostMapping("/getNotificationDetailByCreator")
    public NotificationDetailResponseForCreator getNotificationByCreatorAndNotificationId(@RequestBody NotificationDetailRequest detailRequest) {
        return notificationServiceV2.getNotificationDetailByCreator(detailRequest.getUserId(), detailRequest.getNotificationId());
    }

    @GetMapping("getNotificationByDepartment")
    public List<NotificationDetailResponse> getListScheduledNotificationByDepartmentOfCreator(@RequestParam("userId") String userId) {
        return notificationServiceV2.getListScheduledNotificationByDepartmentOfCreator(userId);
    }

    @PostMapping("/setNotificationHidden")
    public boolean setNotificationHidden(@RequestBody PersonalPriorityRequest setNotificationHidden) {
        return notificationService.notificationHidden(setNotificationHidden.getNotificationId(), setNotificationHidden.getUserId());
    }

    @PostMapping("/deleteNotification")
    public boolean deleteNotification(@RequestBody PersonalPriorityRequest deleteNotification) {
        return notificationService.deleteNotification(deleteNotification.getNotificationId(), deleteNotification.getUserId());
    }

    @GetMapping("/getFileToDownload")
    public FileDataResponse getFileDataByFileId(@RequestParam("file_id") String fileId) {
        return notificationServiceV2.getFileDataToDownload(fileId);
    }

    @GetMapping("/readAllNotification")
    public ResponseEntity<?> readAll(@RequestParam("user_id") String userId) {
        return notificationServiceV2.readAllNotification(userId);
    }
}
