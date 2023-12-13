package fpt.capstone.buildingmanagementsystem.model.response;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder

public class LeaveRequestResponse {
    private String leaveRequestId;
    private String fromDate;
    private String toDate;
    private boolean halfDay;
    private int durationEvaluation;
    private String content;
    private String requestMessageId;
    private TopicEnum topic;
}
