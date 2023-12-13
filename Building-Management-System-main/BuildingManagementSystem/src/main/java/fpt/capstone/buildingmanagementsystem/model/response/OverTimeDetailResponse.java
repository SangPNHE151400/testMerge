package fpt.capstone.buildingmanagementsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OverTimeDetailResponse {
    private String startTime;
    private String endTime;
    private String dateType;
    private String manualStart;

    private String manualEnd;
    private String description;
}
