package fpt.capstone.buildingmanagementsystem.model.response;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.LateType;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LateRequestFormResponse {
    private String lateRequestId;
    private LateType lateType;
    private int lateDuration;
    private Date requestDate;
    private String content;
    private boolean status;
    private String requestMessageId;
    private TopicEnum topic;
}
