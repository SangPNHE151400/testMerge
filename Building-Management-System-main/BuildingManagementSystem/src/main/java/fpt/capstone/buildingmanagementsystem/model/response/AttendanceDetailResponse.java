package fpt.capstone.buildingmanagementsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceDetailResponse {
    private String name;
    private String username;
    private String departmentName;
    private String dateDaily;
    private Time checkin;
    private Time checkout;
    private double totalAttendance;
    private double morningTotal;
    private double afternoonTotal;
    private boolean lateCheckin;
    private boolean earlyCheckout;
    private double permittedLeave;
    private double nonPermittedLeave;
    private boolean leaveWithoutNotice;
    private double outsideWork;
    List<ControlLogResponse> controlLogResponse;
}
