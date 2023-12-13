package fpt.capstone.buildingmanagementsystem.model.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendanceMessageRequest {
    private String attendanceRequestId;
    private String content;
}
