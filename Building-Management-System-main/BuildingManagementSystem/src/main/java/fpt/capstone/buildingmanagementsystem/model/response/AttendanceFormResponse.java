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
public class AttendanceFormResponse {

    private String attendanceRequestId;

    private String manualDate;

    private String manualFirstEntry;

    private String manualLastExit;

    private String content;

    private boolean status;

    private String requestMessageId;

    private TopicEnum topic;

}
