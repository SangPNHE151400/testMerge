package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.Notification;

import java.util.List;

public interface NotificationRepositoryV2 {

    List<Notification> getNotificationByUserId(String userId);
}
