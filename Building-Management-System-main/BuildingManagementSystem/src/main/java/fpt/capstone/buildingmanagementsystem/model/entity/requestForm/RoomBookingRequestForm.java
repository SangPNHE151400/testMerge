package fpt.capstone.buildingmanagementsystem.model.entity.requestForm;

import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import fpt.capstone.buildingmanagementsystem.model.entity.RequestMessage;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.RoomBookingStatus;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.sql.Date;
import java.sql.Time;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity(name = "room_booking_request_form")
public class RoomBookingRequestForm {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private String roomBookingRequestId;

    @Column
    private String title;

    @Column
    private String content;

    @Column
    private Date bookingDate;

    @Column
    private Time startTime;

    @Column
    private Time endTime;

    @Column
    @Enumerated(EnumType.STRING)
    private RoomBookingStatus status;

    @ManyToOne
    @JoinColumn(name = "departmentSenderId")
    private Department departmentSender;

    @ManyToOne
    @JoinColumn(name = "requestMassageId")
    private RequestMessage requestMessage;

    @Enumerated(EnumType.STRING)
    @Column(length = 50, columnDefinition = "varchar(50) default 'ATTENDANCE_REQUEST'")
    private TopicEnum topic = TopicEnum.ROOM_REQUEST;
}
