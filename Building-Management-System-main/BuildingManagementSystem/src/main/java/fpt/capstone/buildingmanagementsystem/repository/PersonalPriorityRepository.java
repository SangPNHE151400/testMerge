package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.Notification;
import fpt.capstone.buildingmanagementsystem.model.entity.PersonalPriority;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonalPriorityRepository extends JpaRepository<PersonalPriority, String> {

    List<PersonalPriority> findByNotificationAndUser(Notification notification, User user);

    void deleteAllByNotification_NotificationId(String id);

}
