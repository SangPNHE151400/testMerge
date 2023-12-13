package fpt.capstone.buildingmanagementsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import java.sql.Time;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyLogResponse {
    private String dailyId;
    private String dateDaily;
    private Time checkin;
    private Time checkout;
    private Time systemCheckIn;
    private Time systemCheckOut;
    private double totalAttendance;
    private double morningTotal;
    private double afternoonTotal;
    private boolean lateCheckin;
    private boolean earlyCheckout;
    private double permittedLeave;
    private double nonPermittedLeave;
    private boolean Violate;
    private double outsideWork;
    private double paidDay;
}
