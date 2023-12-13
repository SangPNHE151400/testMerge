package fpt.capstone.buildingmanagementsystem.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SaveChangeLogRequest {
    String employeeId;
    String managerId;
    String date;
    String manualCheckIn;
    String manualCheckOut;
    String workOutSide;
    String type;
    String changeType;
    boolean violate;
    String reason;
}
