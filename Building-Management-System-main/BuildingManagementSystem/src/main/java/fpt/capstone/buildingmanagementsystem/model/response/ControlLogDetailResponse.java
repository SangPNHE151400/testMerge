package fpt.capstone.buildingmanagementsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ControlLogDetailResponse {
    String avatar;
    String account;
    String role;
    String department;
    String hireDate;
    byte[] image;
    String deviceId;
    String deviceName;
    String time;
    double similar;
    String operator;
    String personId;
    String verifyStatus;
    double Temperature;

}
