package fpt.capstone.buildingmanagementsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Calendar;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TotalAttendanceUser {
    private String date;
    private int totalDate;
    private double totalAttendance;
    private double morningTotal;
    private double afternoonTotal;
    private double lateCheckinTotal;
    private double earlyCheckoutTotal;
    private double permittedLeave;
    private double nonPermittedLeave;
    private double ViolateTotal;
    private double outsideWork;
    private double paidDay;
}
