package fpt.capstone.buildingmanagementsystem.model.entity;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.NotificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity(name = "Notification")
public class Notification {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    private String notificationId;

    @Column
    private String title;

    @Column
    private String content;

    @Column
    private Date createDate;

    @Column
    private Date updateDate;

    @Column
    private Date uploadDate;

    @Column
    @Enumerated(EnumType.STRING)
    private NotificationStatus notificationStatus;

    @Column
    private boolean priority;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User createdBy;
}
