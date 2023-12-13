package fpt.capstone.buildingmanagementsystem.model.response;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.DateType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Time;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyDetailResponse {
    private String firstEntry;
    private String lastExit;
    private float morning_total;
    private float afternoonTotal;
    private float permittedLeave;
    private float nonPermittedLeave;
    private String dateType;
    private float totalTime;
    private float outsideTime;
    private float insideTime;
    private String description;
}
