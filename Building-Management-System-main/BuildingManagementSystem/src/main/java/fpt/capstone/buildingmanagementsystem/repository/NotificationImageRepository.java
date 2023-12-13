package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.Notification;
import fpt.capstone.buildingmanagementsystem.model.entity.NotificationFile;
import fpt.capstone.buildingmanagementsystem.model.entity.NotificationImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationImageRepository extends JpaRepository<NotificationImage,String> {

    List<NotificationImage> findByNotification(Notification notification);
    void deleteAllByNotification_NotificationId(String id);

    List<NotificationImage> getFirstByNotificationIn(List<Notification> notification);

    List<NotificationImage> findByNotificationIn(List<Notification> notifications);


    void deleteByImageFileName(String imageName);
}
