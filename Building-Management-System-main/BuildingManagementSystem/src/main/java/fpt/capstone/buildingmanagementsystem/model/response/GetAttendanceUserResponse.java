package fpt.capstone.buildingmanagementsystem.model.response;

import fpt.capstone.buildingmanagementsystem.model.entity.DailyLog;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Date;
import java.sql.Time;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAttendanceUserResponse{
    String username;
    String department;
    String date;
    String hireDate;
    TotalAttendanceUser totalAttendanceUser;
    List<DailyLogResponse> dailyLogList;
}
