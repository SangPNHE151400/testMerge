package fpt.capstone.buildingmanagementsystem.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.Conflict;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.exception.ServerError;
import fpt.capstone.buildingmanagementsystem.mapper.NotificationMapper;
import fpt.capstone.buildingmanagementsystem.model.entity.Notification;
import fpt.capstone.buildingmanagementsystem.model.entity.NotificationHidden;
import fpt.capstone.buildingmanagementsystem.model.entity.NotificationImage;
import fpt.capstone.buildingmanagementsystem.model.entity.NotificationReceiver;
import fpt.capstone.buildingmanagementsystem.model.entity.PersonalPriority;
import fpt.capstone.buildingmanagementsystem.model.entity.UnreadMark;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import fpt.capstone.buildingmanagementsystem.model.request.SaveNotificationRequest;
import fpt.capstone.buildingmanagementsystem.model.request.UpdateNotificationRequest;
import fpt.capstone.buildingmanagementsystem.repository.NotificationFileRepository;
import fpt.capstone.buildingmanagementsystem.repository.NotificationHiddenRepository;
import fpt.capstone.buildingmanagementsystem.repository.NotificationImageRepository;
import fpt.capstone.buildingmanagementsystem.repository.NotificationReceiverRepository;
import fpt.capstone.buildingmanagementsystem.repository.NotificationRepository;
import fpt.capstone.buildingmanagementsystem.repository.PersonalPriorityRepository;
import fpt.capstone.buildingmanagementsystem.repository.UnreadMarkRepository;
import fpt.capstone.buildingmanagementsystem.repository.UserRepository;
import fpt.capstone.buildingmanagementsystem.until.Until;
import fpt.capstone.buildingmanagementsystem.validate.Validate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.NotificationStatus.DRAFT;
import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.NotificationStatus.SCHEDULED;
import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.NotificationStatus.UPLOADED;

@Service
public class NotificationService {
    @Autowired
    NotificationHiddenRepository notificationHiddenRepository;
    @Autowired
    NotificationReceiverRepository notificationReceiverRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    NotificationMapper notificationMapper;
    @Autowired
    NotificationRepository notificationRepository;
    @Autowired
    UnreadMarkRepository unreadMarkRepository;
    @Autowired
    NotificationImageRepository notificationImageRepository;
    @Autowired
    NotificationFileRepository notificationFileRepository;
    @Autowired
    FileService fileService;

    @Autowired
    PersonalPriorityRepository personalPriorityRepository;

    public boolean saveNotification(String data, MultipartFile[] image, MultipartFile[] file) {
        try {
            List<NotificationReceiver> notificationReceiverList = new ArrayList<>();
            List<UnreadMark> unreadMarkList = new ArrayList<>();
            List<NotificationImage> listImage = new ArrayList<>();
            List<Optional<User>> receivers = new ArrayList<>();
            SaveNotificationRequest saveNotificationRequest = new ObjectMapper().readValue(data, SaveNotificationRequest.class);
            String userId = saveNotificationRequest.getUserId();
            List<String> receiverId = saveNotificationRequest.getReceiverId();
            String title = saveNotificationRequest.getTitle();
            String content = saveNotificationRequest.getContent();
            String uploadDate = saveNotificationRequest.getUploadDatePlan();
            String buttonStatus = saveNotificationRequest.getButtonStatus();
            boolean sendAllStatus = saveNotificationRequest.isSendAllStatus();

            if ((userId != null && title != null && content != null) &&
                    ((!receiverId.isEmpty() && !sendAllStatus) || (receiverId.isEmpty() && sendAllStatus))) {
                Notification notification = notificationMapper.convert(saveNotificationRequest);
                if (uploadDate == null && buttonStatus.equals("upload")) {
                    notification.setNotificationStatus(UPLOADED);
                    notification.setUploadDate(notification.getCreateDate());
                }
                if (uploadDate != null && buttonStatus.equals("upload")) {
                    notification.setNotificationStatus(SCHEDULED);
                }
                if (buttonStatus.equals("save")) {
                    notification.setNotificationStatus(DRAFT);
                }
                setUploadDate(uploadDate, notification);
                Optional<User> sender = userRepository.findByUserId(saveNotificationRequest.getUserId());
                receiverId.forEach(element -> receivers.add(userRepository.findByUserId(element)));
                if (sender.isPresent()) {
                    notification.setCreatedBy(sender.get());
                    notificationRepository.save(notification);
                    saveImageAndFileAndReceiver(image, file, sendAllStatus, notification, receivers, notificationReceiverList, unreadMarkList, listImage);
                    return true;
                } else {
                    throw new NotFound("not_found");
                }
            } else {
                throw new BadRequest("request_fail");
            }
        } catch (ServerError | IOException | ParseException e) {
            throw new ServerError("fail");
        }
    }

    @Transactional
    public boolean changeNotification(String data, MultipartFile[] image, MultipartFile[] file) {
        try {
            List<NotificationReceiver> notificationReceiverList = new ArrayList<>();
            List<UnreadMark> unreadMarkList = new ArrayList<>();
            List<NotificationImage> listImage = new ArrayList<>();
            List<Optional<User>> receivers = new ArrayList<>();

            UpdateNotificationRequest updateNotificationRequest = new ObjectMapper().readValue(data, UpdateNotificationRequest.class);
            String userId = updateNotificationRequest.getUserId();
            List<String> receiverId = updateNotificationRequest.getReceiverId();
            List<String> deleteImage = updateNotificationRequest.getDeleteImage();
            List<String> deleteFile = updateNotificationRequest.getDeleteFileId();
            String title = updateNotificationRequest.getTitle();
            String content = updateNotificationRequest.getContent();
            String uploadDate = updateNotificationRequest.getUploadDatePlan();
            String buttonStatus = updateNotificationRequest.getButtonStatus();
            boolean sendAllStatus = updateNotificationRequest.isSendAllStatus();

            if ((userId != null && title != null && content != null) &&
                    ((!receiverId.isEmpty() && !sendAllStatus) || (receiverId.isEmpty() && sendAllStatus))) {
                Notification notification = notificationMapper.convert(updateNotificationRequest);
                if (uploadDate == null && buttonStatus.equals("upload")) {
                    notification.setNotificationStatus(UPLOADED);
                    notification.setUploadDate(notification.getCreateDate());
                }
                if (uploadDate != null && buttonStatus.equals("upload")) {
                    notification.setNotificationStatus(SCHEDULED);
                }
                if (buttonStatus.equals("save")) {
                    notification.setNotificationStatus(DRAFT);
                }
                setUploadDate(uploadDate, notification);
                Optional<User> sender = userRepository.findByUserId(updateNotificationRequest.getUserId());
                receiverId.forEach(element -> receivers.add(userRepository.findByUserId(element)));
                if (sender.isPresent()) {
                    notification.setCreateDate(notificationRepository.findByNotificationId(updateNotificationRequest.getNotificationId()).getCreateDate());
                    notification.setCreatedBy(sender.get());
                    notificationRepository.save(notification);
                    unreadMarkRepository.deleteAllByNotification_NotificationId(notification.getNotificationId());
                    notificationReceiverRepository.deleteAllByNotification_NotificationId(notification.getNotificationId());
                    if (deleteFile.size() > 0) {
                        for (String deleteId : deleteFile) {
                            notificationFileRepository.deleteByFileId(deleteId);
                        }
                    }
                    for (String s : deleteImage) {
                        notificationImageRepository.deleteByImageFileName(s);
                    }
                    ExecutorService executorService = Executors.newFixedThreadPool(5);
                    for (int i = 0; i < deleteImage.size(); i++) {
                        int finalI = i;
                        executorService.submit(() -> {
                            Bucket bucket = StorageClient.getInstance().bucket();
                            Blob blob = bucket.get(deleteImage.get(finalI));
                            if (blob != null) {
                                blob.delete();
                            }
                        });
                    }
                    executorService.shutdown();
                    saveImageAndFileAndReceiver(image, file, sendAllStatus, notification, receivers, notificationReceiverList, unreadMarkList, listImage);
                    return true;
                } else {
                    throw new NotFound("not_found");
                }
            } else {
                throw new BadRequest("request_fail");
            }
        } catch (ServerError | IOException | ParseException e) {
            throw new ServerError("fail");
        }
    }

    private static void setUploadDate(String uploadDate, Notification notification) throws ParseException {
        if (uploadDate != null) {
            if (Validate.validateDateAndTime(uploadDate) && Validate.checkUploadDateRealTime(uploadDate)) {
                notification.setUploadDate(Until.convertStringToDateTime(uploadDate));
            } else {
                throw new BadRequest("request_fail");
            }
        }
    }

    private void saveImageAndFileAndReceiver(MultipartFile[] image, MultipartFile[] file, boolean sendAllStatus, Notification notification, List<Optional<User>> receivers, List<NotificationReceiver> notificationReceiverList, List<UnreadMark> unreadMarkList, List<NotificationImage> listImage) throws IOException {
        saveFileAndReceiver(file, sendAllStatus, notification, receivers, notificationReceiverList, unreadMarkList);
        if (image.length > 0) {
            setListImage(image, notification, listImage);
        }
    }

    @Transactional
    public void saveFileAndReceiver(MultipartFile[] file, boolean sendAllStatus, Notification notification, List<Optional<User>> receivers, List<NotificationReceiver> notificationReceiverList, List<UnreadMark> unreadMarkList) throws IOException {
        if (receivers.size() > 0) {
            receivers.forEach(receiver -> notificationReceiverList.add(
                    setNotificationReceiver(sendAllStatus, notification, receiver)));
            notificationReceiverRepository.saveAll(notificationReceiverList);
            receivers.forEach(receiver -> unreadMarkList.add(
                    setUnreadMark(notification, receiver)));
            unreadMarkRepository.saveAll(unreadMarkList);
        }
        if (sendAllStatus && receivers.size() == 0) {
            ExecutorService executorService = Executors.newFixedThreadPool(5);
            List<User> list = userRepository.findAll();
            for (User user : list) {
                executorService.submit(() -> {
                    UnreadMark unreadMark = new UnreadMark();
                    unreadMark.setNotification(notification);
                    unreadMark.setUser(user);
                    unreadMarkList.add(unreadMark);
                    unreadMarkRepository.save(unreadMark);
                });
            }
            executorService.shutdown();
            notificationReceiverRepository.save(setNotificationReceiver(sendAllStatus, notification, Optional.empty()));
        }
        if (file.length > 0) {
            fileService.store(file, notification);
        }
    }

    private void setListImage(MultipartFile[] image, Notification notification, List<NotificationImage> listImage) throws IOException {
        ExecutorService executorService = Executors.newFixedThreadPool(5);
        for (int i = 0; i < image.length; i++) {
            int finalI = i;
            byte[] imageBytes = image[finalI].getBytes();
            executorService.submit(() -> saveImageToDB(image, notification, listImage, finalI, imageBytes));
        }
        executorService.shutdown();
    }

    private void saveImageToDB(MultipartFile[] image, Notification notification, List<NotificationImage> listImage, int finalI, byte[] imageBytes) {
        String imageName = "notification_" + UUID.randomUUID();
        String[] subFileName = Objects.requireNonNull(image[finalI].getOriginalFilename()).split("\\.");
        List<String> stringList = new ArrayList<>(Arrays.asList(subFileName));
        imageName = imageName + "." + stringList.get(stringList.size() - 1);
        Bucket bucket = StorageClient.getInstance().bucket();
        bucket.create(imageName, imageBytes, image[finalI].getContentType());
        NotificationImage notificationImage = new NotificationImage();
        notificationImage.setImageFileName(imageName);
        notificationImage.setNotification(notification);
        listImage.add(notificationImage);
        notificationImageRepository.saveAndFlush(notificationImage);
    }

    private NotificationReceiver setNotificationReceiver(boolean sendAllStatus, Notification notification, Optional<User> receiver) {
        NotificationReceiver notificationReceiver = new NotificationReceiver();
        notificationReceiver.setNotification(notification);
        receiver.ifPresent(notificationReceiver::setReceiver);
        notificationReceiver.setSendAllStatus(sendAllStatus);
        return notificationReceiver;
    }

    private UnreadMark setUnreadMark(Notification notification, Optional<User> receiver) {
        UnreadMark unreadMark = new UnreadMark();
        unreadMark.setNotification(notification);
        receiver.ifPresent(unreadMark::setUser);
        return unreadMark;
    }

    public boolean markAsRead(String notificationId, String userId) {

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new BadRequest("Not_found_notification"));

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequest("Not_found_user"));

        UnreadMark unreadMark = unreadMarkRepository.findByNotificationAndUser(notification, user)
                .orElseThrow(() -> new BadRequest("Not_found_unread_notification"));
        try {
            unreadMarkRepository.delete(unreadMark);
            return true;
        } catch (Exception e) {
            throw new ServerError("fail");
        }
    }

    public boolean markAsUnRead(String notificationId, String userId) {

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new BadRequest("Not_found_notification"));

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequest("Not_found_user"));

        UnreadMark unreadMark = UnreadMark.builder()
                .notification(notification)
                .user(user)
                .build();
        Optional<UnreadMark> record = unreadMarkRepository.findByNotificationAndUser(notification, user);
        try {
            if (!record.isPresent()) {
                unreadMarkRepository.save(unreadMark);
            }
            return true;
        } catch (Exception e) {
            throw new ServerError("fail");
        }
    }

    public boolean unsetPersonalPriority(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new BadRequest("Not_found_notification"));

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequest("Not_found_user"));

        List<PersonalPriority> personalPriority = personalPriorityRepository.findByNotificationAndUser(notification, user);

        try {
            if (personalPriority.isEmpty()) return false;
            personalPriorityRepository.deleteAll(personalPriority);
            return true;
        } catch (Exception e) {
            throw new ServerError("fail");
        }
    }

    public boolean setPersonalPriority(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new BadRequest("Not_found_notification"));

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequest("Not_found_user"));

        PersonalPriority personalPriority = PersonalPriority.builder()
                .user(user)
                .notification(notification)
                .build();
        List<PersonalPriority> existedPriority = personalPriorityRepository.findByNotificationAndUser(notification, user);

        try {
            if (existedPriority.isEmpty()) {
                personalPriorityRepository.save(personalPriority);
            }
            return true;
        } catch (Exception e) {
            throw new ServerError("fail");
        }
    }

    @Transactional
    public boolean deleteNotification(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new BadRequest("Not_found_notification"));
        userRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequest("Not_found_user"));
        if (userId.equals(notification.getCreatedBy().getUserId())) {

            if (!notification.getNotificationStatus().equals(UPLOADED)) {
                try {
                    notificationHiddenRepository.deleteAllByNotification_NotificationId(notificationId);
                    notificationFileRepository.deleteAllByNotification_NotificationId(notificationId);
                    notificationImageRepository.deleteAllByNotification_NotificationId(notificationId);
                    personalPriorityRepository.deleteAllByNotification_NotificationId(notificationId);
                    unreadMarkRepository.deleteAllByNotification_NotificationId(notificationId);
                    notificationReceiverRepository.deleteAllByNotification_NotificationId(notificationId);
                    notificationRepository.delete(notification);
                    return true;
                } catch (Exception e) {
                    throw new ServerError("fail");
                }
            } else {
                throw new Conflict("Notification_Upload");
            }
        } else {
            throw new BadRequest("request_fail");
        }
    }

    public boolean notificationHidden(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new BadRequest("Not_found_notification"));

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequest("Not_found_user"));

        NotificationHidden personalPriority = NotificationHidden.builder()
                .user(user)
                .notification(notification)
                .build();
        try {
            if (!notification.isPriority()) {
                notificationHiddenRepository.save(personalPriority);
                return true;
            } else {
                throw new Conflict("fail");
            }
        } catch (Exception e) {
            throw new ServerError("fail");
        }
    }

    public void hiddenNotificationSendAll(User user) {
        List<Notification> notifications = notificationRepository.getSendToAllNotification();
        List<NotificationHidden> hiddens = new ArrayList<>();
        notifications.forEach(notification -> {
            NotificationHidden hidden = NotificationHidden.builder()
                    .user(user)
                    .notification(notification)
                    .build();
            hiddens.add(hidden);
        });
        try {
            notificationHiddenRepository.saveAll(hiddens);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ServerError("fail");
        }
    }

    public void deleteFromHiddenNotification(User user) {
        try {
            notificationHiddenRepository.deleteAllByUser(user);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ServerError("fail");
        }
    }
}
