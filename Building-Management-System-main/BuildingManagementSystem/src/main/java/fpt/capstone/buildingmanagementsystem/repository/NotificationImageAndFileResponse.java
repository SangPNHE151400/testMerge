package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.response.ImageResponse;
import fpt.capstone.buildingmanagementsystem.model.response.NotificationFileResponseV2;

import java.util.List;

public interface NotificationImageAndFileResponse {
    List<ImageResponse> getImageByNotificationIn(List<String> notificationIds);

    List<NotificationFileResponseV2> getFileByNotificationIn(List<String> notificationIds);

}
