package fpt.capstone.buildingmanagementsystem.model.entity.requestForm;

import fpt.capstone.buildingmanagementsystem.model.entity.RequestMessage;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicEnum;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicOvertime;
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
@Entity
public class OvertimeRequestForm {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private String overtimeRequestId;

    @Column
    private Date overtimeDate;

    @Column
    private Time fromTime;

    @Column
    private Time toTime;

    @Column
    @Enumerated(EnumType.STRING)
    private TopicOvertime topicOvertime;

    @Column
    private String content;

    @Column
    private boolean status;

    @ManyToOne
    @JoinColumn(name = "requestMassageId")
    private RequestMessage requestMessage;

    @Enumerated(EnumType.STRING)
    @Column(length = 50, columnDefinition = "varchar(50) default 'OVERTIME_REQUEST'")
    private TopicEnum topic = TopicEnum.OVERTIME_REQUEST;
}
