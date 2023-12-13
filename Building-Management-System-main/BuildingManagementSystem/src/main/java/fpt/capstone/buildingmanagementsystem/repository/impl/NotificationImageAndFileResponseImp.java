package fpt.capstone.buildingmanagementsystem.repository.impl;

import fpt.capstone.buildingmanagementsystem.model.response.ImageResponse;
import fpt.capstone.buildingmanagementsystem.model.response.NotificationFileResponseV2;
import fpt.capstone.buildingmanagementsystem.repository.NotificationImageAndFileResponse;
import org.hibernate.query.NativeQuery;
import org.hibernate.transform.Transformers;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class NotificationImageAndFileResponseImp implements NotificationImageAndFileResponse {

    @PersistenceContext
    EntityManager entityManager;

    @Override
    public List<ImageResponse> getImageByNotificationIn(List<String> notificationIds) {

        String query = "SELECT i.image_id as imageId," +
                "i.image_file_name as imageName," +
                "i.notification_id as notificationId\n" +
                "FROM notification_image i\n" +
                "WHERE i.notification_id IN :notificationIds";

        return (List<ImageResponse>) entityManager.createNativeQuery(query).unwrap(NativeQuery.class)
                .setParameter("notificationIds", notificationIds)
                .setResultTransformer(Transformers.aliasToBean(ImageResponse.class))
                .getResultList().stream()
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationFileResponseV2> getFileByNotificationIn(List<String> notificationIds) {
        String query = "SELECT n.file_id as fileId, \n" +
                "       n.name as fileName, \n" +
                "       n.notification_id as notificationId\n" +
                "FROM notification_file n\n" +
                "WHERE n.notification_id IN :notificationIds";

        return (List<NotificationFileResponseV2>) entityManager.createNativeQuery(query).unwrap(NativeQuery.class)
                .setParameter("notificationIds", notificationIds)
                .setResultTransformer(Transformers.aliasToBean(NotificationFileResponseV2.class))
                .getResultList().stream()
                .collect(Collectors.toList());
    }
}
