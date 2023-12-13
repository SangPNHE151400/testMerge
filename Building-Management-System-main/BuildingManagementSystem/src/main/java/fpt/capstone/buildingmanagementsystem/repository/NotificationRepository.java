package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.Notification;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {

    @Query(value = "SELECT n.*\n" +
            "FROM notification n\n" +
            "JOIN unread_mark um ON n.notification_id = um.notification_id\n" +
            "JOIN user u ON u.user_id = um.user_id\n" +
            "WHERE um.user_id LIKE :userId", nativeQuery = true)
    List<Notification> getUnreadMarkNotificationByUserId(@Param("userId") String userId);


    @Query(value = "SELECT n.*\n" +
            "FROM notification n\n" +
            "         JOIN notification_receiver nr ON n.notification_id = nr.notification_id\n" +
            "WHERE (nr.receiver_id LIKE :userId\n" +
            "   OR nr.send_all_status IS TRUE) AND n.notification_status LIKE 'UPLOADED'", nativeQuery = true)
    List<Notification> getNotificationByUserId(@Param("userId") String userId);

    @Query(value = "SELECT n.*\n" +
            "FROM notification n\n" +
            "         JOIN notification_receiver nr ON n.notification_id = nr.notification_id\n" +
            "         LEFT JOIN user u ON u.user_id = nr.receiver_id\n" +
            "WHERE (nr.receiver_id LIKE :userId AND n.notification_id LIKE :notificationId)\n" +
            "   OR (nr.send_all_status IS TRUE AND n.notification_id LIKE :notificationId)\n" +
            "AND n.notification_status LIKE 'UPLOADED'", nativeQuery = true)
    Optional<Notification> getNotificationByUserIdAndNotificationId(@Param("userId") String userId, @Param("notificationId") String notificationId);

    @Query(value = "SELECT *\n" +
            "FROM notification n\n" +
            "JOIN notification_hidden nh ON n.notification_id = nh.notification_id\n" +
            "JOIN user u ON u.user_id = nh.user_id\n" +
            "WHERE nh.user_id LIKE :userId", nativeQuery = true)
    List<Notification> getHiddenNotificationByUserId(@Param("userId") String userId);

    @Query(value = "SELECT *\n" +
            "FROM notification n\n" +
            "JOIN notification_hidden nh ON n.notification_id = nh.notification_id\n" +
            "JOIN user u ON u.user_id = nh.user_id\n" +
            "WHERE nh.user_id LIKE :userId AND nh.notification_id LIKE :notificationId", nativeQuery = true)
    List<Notification> getHiddenNotificationByUserIdAndNotification(@Param("userId") String userId, @Param("notificationId") String notificationId);

    @Query(value = "SELECT *\n" +
            "FROM notification n\n" +
            "JOIN personal_priority pp ON n.notification_id = pp.notification_id\n" +
            "WHERE pp.user_id LIKE :userId", nativeQuery = true)
    List<Notification> getPersonalPriorityByUserId(@Param("userId") String userId);
    List<Notification> findAllByNotificationStatus(NotificationStatus notificationStatus);

    Optional<Notification>  findByCreatedByAndNotificationId(User user, String notificationId);

    List<Notification> findByCreatedBy(User user);
    Notification findByNotificationId(String id);
    @Query(value = "SELECT *\n" +
            "FROM notification n\n" +
            "JOIN user u ON u.user_id = n.user_id\n" +
            "JOIN department d ON d.department_id = u.department_id\n" +
            "WHERE d.department_id LIKE :departmentId", nativeQuery = true)
    List<Notification> getNotificationByDepartment(@Param("departmentId") String departmentId);

    @Query(value = "SELECT *\n" +
            "FROM notification n\n" +
            "JOIN notification_receiver nr ON n.notification_id = nr.notification_id\n" +
            "WHERE send_all_status = TRUE;", nativeQuery = true)
    List<Notification> getSendToAllNotification();
}
