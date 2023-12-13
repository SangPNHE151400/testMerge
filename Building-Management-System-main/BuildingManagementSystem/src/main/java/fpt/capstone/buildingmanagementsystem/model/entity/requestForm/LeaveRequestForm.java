package fpt.capstone.buildingmanagementsystem.model.entity.requestForm;

import fpt.capstone.buildingmanagementsystem.model.entity.RequestMessage;
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
import javax.persistence.Table;
import java.sql.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "leave_request_form")
public class LeaveRequestForm {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private String leaveRequestId;

    @Column
    private Date fromDate;

    @Column
    private Date toDate;

    @Column
    private boolean halfDay;

    @Column
    private int durationEvaluation;

    @Column
    private String content;

    @Column
    private boolean status;

    @ManyToOne
    @JoinColumn(name = "requestMassageId")
    private RequestMessage requestMessage;

    @Enumerated(EnumType.STRING)
    @Column(length = 50, columnDefinition = "varchar(50) default 'ATTENDANCE_REQUEST'")
    private TopicEnum topic = TopicEnum.LEAVE_REQUEST;
}
