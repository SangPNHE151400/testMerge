package fpt.capstone.buildingmanagementsystem.model.request;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicOvertime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import java.sql.Date;
import java.sql.Time;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SendOvertimeFormRequest {
    String userId;
    String ticketId;
    String requestId;
    String overtimeDate;
    String topicOvertime;
    String fromTime;
    String toTime;
    String title;
    String content;
    String departmentId;
    String receivedId;
}
