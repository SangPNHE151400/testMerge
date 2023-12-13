package fpt.capstone.buildingmanagementsystem.service.schedule;
import fpt.capstone.buildingmanagementsystem.model.entity.Notification;
import fpt.capstone.buildingmanagementsystem.repository.NotificationRepository;
import fpt.capstone.buildingmanagementsystem.until.Until;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.*;
import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.NotificationStatus.SCHEDULED;
import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.NotificationStatus.UPLOADED;

@Service
public class NotificationUploadScheduledService {
    @Autowired
    NotificationRepository notificationRepository;
    @Scheduled(cron = "0 0/2 * * * ?")
    public void getAllNotificationScheduled(){
        List<Notification> notificationList= notificationRepository.findAllByNotificationStatus(SCHEDULED);
        if(notificationList.size()>0) {
            for (Notification notification : notificationList) {
                Timer timer = new Timer();
                Date scheduledTime = new Date();
                scheduledTime.setTime(notification.getUploadDate().getTime());
                notification.setNotificationStatus(UPLOADED);
                notification.setUpdateDate(Until.generateRealTime());
                UpdateUploadDate uploadDate = new UpdateUploadDate(notification, notificationRepository);
                timer.schedule(uploadDate, scheduledTime);
            }
        }
    }
}
class UpdateUploadDate extends TimerTask {
    private final Notification notification;
    private final NotificationRepository notificationRepository;
    public UpdateUploadDate(Notification notification, NotificationRepository notificationRepository) {
        this.notification = notification;
        this.notificationRepository = notificationRepository;
    }
    @Override
    public void run() {
        notificationRepository.save(notification);
    }
}
