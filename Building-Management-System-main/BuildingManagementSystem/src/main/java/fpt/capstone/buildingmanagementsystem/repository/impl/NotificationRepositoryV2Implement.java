package fpt.capstone.buildingmanagementsystem.repository.impl;

import fpt.capstone.buildingmanagementsystem.model.dto.TicketDto;
import fpt.capstone.buildingmanagementsystem.model.entity.Notification;
import fpt.capstone.buildingmanagementsystem.repository.NotificationRepositoryV2;
import org.hibernate.query.NativeQuery;
import org.hibernate.transform.Transformers;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class NotificationRepositoryV2Implement implements NotificationRepositoryV2 {

    @PersistenceContext
    EntityManager entityManager;

    @Override
    @Deprecated
    public List<Notification> getNotificationByUserId(String userId) {

        String query = "SELECT n.notification_id     AS notificationId,\n" +
                "       n.content,\n" +
                "       n.create_date         AS createDate,\n" +
                "       n.notification_status AS notificationStatus,\n" +
                "       n.priority,\n" +
                "       n.title,\n" +
                "       n.update_date         AS updateDate,\n" +
                "       n.upload_date         AS uploadDate,\n" +
                "       n.user_id             AS createdBy\n" +
                "FROM notification n\n" +
                " JOIN notification_receiver nr ON n.notification_id = nr.notification_id\n" +
                "LEFT JOIN user u ON u.user_id = nr.receiver_id\n" +
                "WHERE nr.receiver_id LIKE :userId OR nr.send_all_status IS TRUE;";

        return (List<Notification>) entityManager.createNativeQuery(query).unwrap(NativeQuery.class)
                .setParameter("userId", userId)
                .setResultTransformer(Transformers.aliasToBean(Notification.class))
                .getResultList().stream()
                .collect(Collectors.toList());
    }
}
