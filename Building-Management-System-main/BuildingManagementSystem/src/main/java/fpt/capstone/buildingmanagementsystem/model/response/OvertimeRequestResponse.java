package fpt.capstone.buildingmanagementsystem.model.response;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicEnum;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicOvertime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.sql.Time;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OvertimeRequestResponse {
    private String overtimeRequestId;

    private Date overtimeDate;

    private Time fromTime;

    private Time toTime;

    private TopicOvertime topicOvertime;

    private String content;

    private boolean status;

    private String requestMessageId;

    private TopicEnum topic;
}
