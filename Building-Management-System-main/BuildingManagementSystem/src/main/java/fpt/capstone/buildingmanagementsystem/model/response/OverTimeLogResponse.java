package fpt.capstone.buildingmanagementsystem.model.response;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.DateType;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicOvertime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.sql.Time;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OverTimeLogResponse {
    private String date;
    private Time checkin;
    private Time checkout;
    private DateType dateType;
    private Time systemCheckIn;
    private Time systemCheckOut;
    private double totalAttendance;
    private Date approveDate;
    private double totalPaid;
}
