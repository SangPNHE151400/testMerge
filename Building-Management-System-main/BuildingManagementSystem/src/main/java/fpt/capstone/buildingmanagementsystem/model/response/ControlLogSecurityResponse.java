package fpt.capstone.buildingmanagementsystem.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ControlLogSecurityResponse {
    String ControlLogId;
    byte[] image;
    String username;
    String firstName;
    String lastName;
    String department;
    String timeRecord;
    String verifyType;
    String room;
}
