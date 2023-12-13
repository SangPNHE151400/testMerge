package fpt.capstone.buildingmanagementsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.util.List;
@AllArgsConstructor
@Data
@NoArgsConstructor
@Builder
public class ChangeLogDetailResponse {
    private String name;
    private String username;
    private String departmentName;
    private String dateDaily;
    private Time checkin;
    private Time checkout;
    private Time checkinChange;
    private Time checkoutChange;
    private String dateDailyChange;
    private String changeFrom;
    private String reason;
    private boolean violate;
    private double outSideWork;
    List<ControlLogResponse> controlLogResponse;
}
