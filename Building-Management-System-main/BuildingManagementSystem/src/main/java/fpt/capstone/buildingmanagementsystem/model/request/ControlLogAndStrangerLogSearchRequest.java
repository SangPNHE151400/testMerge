package fpt.capstone.buildingmanagementsystem.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ControlLogAndStrangerLogSearchRequest {
    String date;
    String startTime;
    String endTime;
    String deviceId;
}
