package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.Notification;
import fpt.capstone.buildingmanagementsystem.model.entity.UnreadMark;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UnreadMarkRepository extends JpaRepository<UnreadMark, String> {
    Optional<UnreadMark> findByNotificationAndUser(Notification notification, User user);
    void deleteAllByNotification_NotificationId(String id);

    List<UnreadMark> findByUser(User user);
}
