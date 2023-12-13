package fpt.capstone.buildingmanagementsystem.model.response;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicEnum;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.WorkingOutsideType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class WorkingOutsideFormResponse {
    private String workingOutsideId;

    private Date date;

    private WorkingOutsideType type;

    private String content;


    private String requestMessageId;

    private TopicEnum topic;
}
