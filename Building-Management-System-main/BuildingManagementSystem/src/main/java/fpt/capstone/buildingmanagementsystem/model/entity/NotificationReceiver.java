package fpt.capstone.buildingmanagementsystem.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity(name = "notification_receiver")
public class NotificationReceiver {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private String notificationReceiverId;

    @Column
    private boolean sendAllStatus;

    @ManyToOne
    @JoinColumn(name = "receiverId")
    private User receiver;

    @ManyToOne
    @JoinColumn(name = "notificationId")
    private Notification notification;
}
